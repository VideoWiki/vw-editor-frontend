import axios from 'axios';
import store from '../store/store';
import slugify from 'slugify';
import { Buffer } from 'buffer';
import {
  ProviderInstance,
  Nft,
  generateDid,
  getHash,
  NftFactory,
  ConfigHelper,
  fixedRateExchange,
  ZERO_ADDRESS,
} from '@oceanprotocol/lib';
import constants from '../../constant';

const chainId = 5;
const algorithmContainerPresets = [
  {
    image: 'node',
    tag: 'latest',
    entrypoint: 'node $ALGO',
    checksum: '',
  },
  {
    image: 'python',
    tag: 'latest',
    entrypoint: 'python $ALGO',
    checksum: '',
  },
];
let Web3, accountId;

async function getEncryptedFiles(files, providerUrl) {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const response = await ProviderInstance.encrypt(files, providerUrl);
    return response;
  } catch (error) {
    console.error('Error in getEncryptedFiles parsing json: ' + error.message);
  }
}

function mapTimeoutStringToSeconds(timeout) {
  switch (timeout) {
    case 'Forever':
      return 0;
    case '1 day':
      return 86400;
    case '1 week':
      return 604800;
    case '1 month':
      return 2630000;
    case '1 year':
      return 31556952;
    default:
      return 0;
  }
}

// nftFactory; // reference @context/web3.ts
async function nftFactory() {
  if (!Web3 || !chainId) return;
  const config = getOceanConfig(chainId);
  if (config === undefined) {
    throw new Error('Config is Undefined');
  }
  const factory = await new NftFactory(config.nftFactoryAddress, Web3);
  return factory;
}

// getOceanConfig
// import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'

function getOceanConfig(network) {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : constants.infuraId
  );
  return config;
}

// createTokensAndPricing
async function createTokensAndPricing(
  values,
  accountId,
  config,
  nftFactory,
  web3
) {
  const nftCreateData = generateNftCreateData(
    values.metadata.nft,
    accountId,
    values.metadata.transferable
  );

  // TODO: cap is hardcoded for now to 1000, this needs to be discussed at some point
  const ercParams = {
    templateIndex: 2,
    minter: accountId,
    paymentCollector: accountId,
    mpFeeAddress: '0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d', // marketFeeAddress, // 0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d
    feeToken: values.pricing.baseToken.address,
    feeAmount: '0', // publisherMarketOrderFee,  // Discuss
    // max number
    cap: '115792089237316195423570985008687907853269984665640564039457',
    name: values.services[0].dataTokenOptions.name,
    symbol: values.services[0].dataTokenOptions.symbol,
  };

  let erc721Address, datatokenAddress, txHash;

  switch (values.pricing.type) {
    default:
      break;
    case 'fixed': {
      const freParams = {
        fixedRateAddress: config.fixedRateExchangeAddress,
        baseTokenAddress: values.pricing.baseToken.address,
        owner: accountId,
        marketFeeCollector: '0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d', // marketFeeAddress, //0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d
        baseTokenDecimals: values.pricing.baseToken.decimals,
        datatokenDecimals: 18,
        fixedRate: values.pricing.price.toString(),
        marketFee: '0', // publisherMarketFixedSwapFee, // '0' //Discuss
        withMint: true,
      };
      const result = await nftFactory.createNftWithDatatokenWithFixedRate(
        accountId,
        nftCreateData,
        ercParams,
        freParams
      );
      erc721Address = result.events.NFTCreated.returnValues[0];
      datatokenAddress = result.events.TokenCreated.returnValues[0];
      txHash = result.transactionHash;
      break;
    }
    case 'free': {
      // maxTokens -  how many tokens cand be dispensed when someone requests . If maxTokens=2 then someone can't request 3 in one tx
      // maxBalance - how many dt the user has in it's wallet before the dispenser will not dispense dt
      // both will be just 1 for the market
      const dispenserParams = {
        dispenserAddress: config.dispenserAddress,
        maxTokens: web3.utils.toWei('1'),
        maxBalance: web3.utils.toWei('1'),
        withMint: true,
        allowedSwapper: ZERO_ADDRESS,
      };
      const result = await nftFactory.createNftWithDatatokenWithDispenser(
        accountId,
        nftCreateData,
        ercParams,
        dispenserParams
      );
      erc721Address = result.events.NFTCreated.returnValues[0];
      datatokenAddress = result.events.TokenCreated.returnValues[0];
      txHash = result.transactionHash;
      break;
    }
  }

  return { erc721Address, datatokenAddress, txHash };
}

// getAlgorithmContainerPreset
async function getContainerChecksum(image, tag) {
  const containerInfo = {
    exists: false,
    checksum: null,
  };
  try {
    const response = await axios.post(
      `https://dockerhub-proxy.oceanprotocol.com`,
      {
        image,
        tag,
      }
    );
    if (
      !response ||
      response.status !== 200 ||
      response.data.status !== 'success'
    ) {
      console.error(
        'Could not fetch docker hub image informations. If you have it hosted in a 3rd party repository please fill in the container checksum manually.'
      );
      return containerInfo;
    }
    containerInfo.exists = true;
    containerInfo.checksum = response.data.result.checksum;
    return containerInfo;
  } catch (error) {
    console.error(error.message);
    console.error(
      'Could not fetch docker hub image informations. If you have it hosted in a 3rd party repository please fill in the container checksum manually.'
    );
    return containerInfo;
  }
}
async function getAlgorithmContainerPreset(dockerImage) {
  if (dockerImage === '') return;

  const preset = algorithmContainerPresets.find(
    (preset) => `${preset.image}:${preset.tag}` === dockerImage
  );
  preset.checksum = await (
    await getContainerChecksum(preset.image, preset.tag)
  ).checksum;
  return preset;
}

// transformPublishFormToDdo
function dateToStringNoMS(date) {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z');
}
function transformTags(originalTags) {
  const transformedTags = originalTags.map((tag) => slugify(tag).toLowerCase());
  return transformedTags;
}
function getUrlFileExtension(fileUrl) {
  const splittedFileUrl = fileUrl.split('.');
  return splittedFileUrl[splittedFileUrl.length - 1];
}
async function transformPublishFormToDdo(
  values,
  // Those 2 are only passed during actual publishing process
  // so we can always assume if they are not passed, we are on preview.
  datatokenAddress,
  nftAddress
) {
  const { metadata, services, user } = values;
  const { chainId, accountId } = user;
  const {
    type,
    name,
    description,
    tags,
    author,
    termsAndConditions,
    dockerImage,
    dockerImageCustom,
    dockerImageCustomTag,
    dockerImageCustomEntrypoint,
    dockerImageCustomChecksum,
  } = metadata;
  const { access, files, links, providerUrl, timeout } = services[0];

  const did = nftAddress ? generateDid(nftAddress, chainId) : '0x...';
  const currentTime = dateToStringNoMS(new Date());
  const isPreview = !datatokenAddress && !nftAddress;
  const algorithmContainerPresets =
    type === 'algorithm' && dockerImage !== '' && dockerImage !== 'custom'
      ? await getAlgorithmContainerPreset(dockerImage)
      : null;
  // Transform from files[0].url to string[] assuming only 1 file
  const filesTransformed = files.length &&
    files[0].valid && [sanitizeUrl(files[0].url)];
  const linksTransformed = links.length &&
    links[0].valid && [sanitizeUrl(links[0].url)];

  const newMetadata = {
    created: currentTime,
    updated: currentTime,
    type,
    name,
    description,
    tags: transformTags(tags),
    author,
    license: 'https://market.oceanprotocol.com/terms',
    links: linksTransformed,
    additionalInformation: {
      termsAndConditions,
    },
    ...(type === 'algorithm' &&
      dockerImage !== '' && {
        algorithm: {
          language: filesTransformed.length
            ? getUrlFileExtension(filesTransformed[0])
            : '',
          version: '0.1',
          container: {
            entrypoint:
              dockerImage === 'custom'
                ? dockerImageCustomEntrypoint
                : algorithmContainerPresets.entrypoint,
            image:
              dockerImage === 'custom'
                ? dockerImageCustom
                : algorithmContainerPresets.image,
            tag:
              dockerImage === 'custom'
                ? dockerImageCustomTag
                : algorithmContainerPresets.tag,
            checksum:
              dockerImage === 'custom'
                ? dockerImageCustomChecksum
                : algorithmContainerPresets.checksum,
          },
        },
      }),
  };

  // this is the default format hardcoded
  const file = {
    nftAddress,
    datatokenAddress,
    files: [
      {
        type: 'url',
        index: 0,
        url: files[0].url,
        method: 'GET',
      },
    ],
  };
  const filesEncrypted =
    !isPreview &&
    files.length &&
    files[0].valid &&
    (await getEncryptedFiles(file, providerUrl.url));

  const newService = {
    id: getHash(datatokenAddress + filesEncrypted),
    type: access,
    files: filesEncrypted || '',
    datatokenAddress,
    serviceEndpoint: providerUrl.url,
    timeout: mapTimeoutStringToSeconds(timeout),
    ...(access === 'compute' && {
      compute: values.services[0].computeOptions,
    }),
  };

  const newDdo = {
    '@context': ['https://w3id.org/did/v1'],
    id: did,
    nftAddress,
    version: '4.1.0',
    chainId,
    metadata: newMetadata,
    services: [newService],
    // Only added for DDO preview, reflecting Asset response,
    // again, we can assume if `datatokenAddress` is not passed,
    // we are on preview.
    ...(!datatokenAddress && {
      datatokens: [
        {
          name: values.services[0].dataTokenOptions.name,
          symbol: values.services[0].dataTokenOptions.symbol,
        },
      ],
      nft: {
        ...generateNftCreateData(values.metadata.nft, accountId),
      },
    }),
  };

  return newDdo;
}

// generateNftCreateData
function generateNftCreateData(nftMetadata, accountId, transferable = true) {
  const nftCreateData = {
    name: nftMetadata.name,
    symbol: nftMetadata.symbol,
    templateIndex: 1,
    tokenURI: '',
    transferable,
    owner: accountId,
  };

  return nftCreateData;
}

// sanitizeUrl
function sanitizeUrl(url) {
  const u = decodeURI(url).trim().toLowerCase();
  const isAllowedUrlScheme =
    u.startsWith('http://') || u.startsWith('https://');
  return isAllowedUrlScheme ? url : 'about:blank';
}

// setNFTMetadataAndTokenURI
async function setNFTMetadataAndTokenURI(
  asset,
  accountId,
  web,
  nftMetadata,
  signal
) {
  const encryptedDdo = await ProviderInstance.encrypt(
    asset,
    asset.services[0].serviceEndpoint,
    signal
  );

  const metadataHash = getHash(JSON.stringify(asset));

  // add final did to external_url and asset link to description in nftMetadata before encoding
  const externalUrl = `${nftMetadata.external_url}/asset/${asset.id}`;
  const encodedMetadata = Buffer.from(
    // Discuss Don't Know
    JSON.stringify({
      ...nftMetadata,
      description: `${nftMetadata.description}\n\nView on Ocean Market: ${externalUrl}`,
      external_url: externalUrl,
    })
  ).toString('base64');
  const nft = new Nft(Web3);

  // theoretically used by aquarius or provider, not implemented yet, will remain hardcoded
  const flags = '0x02';

  const metadataAndTokenURI = {
    metaDataState: 0,
    metaDataDecryptorUrl: asset.services[0].serviceEndpoint,
    metaDataDecryptorAddress: '',
    flags,
    data: encryptedDdo,
    metaDataHash: '0x' + metadataHash,
    tokenId: 1,
    tokenURI: `data:application/json;base64,${encodedMetadata}`,
    metadataProofs: [],
  };
  const setMetadataAndTokenURITx = await nft.setMetadataAndTokenURI(
    asset.nftAddress,
    accountId,
    metadataAndTokenURI
  );

  return setMetadataAndTokenURITx;
}

async function create(values) {
  try {
    const config = getOceanConfig(chainId);
    const { erc721Address, datatokenAddress, txHash } =
      await createTokensAndPricing(
        values,
        accountId,
        config,
        await nftFactory(),
        Web3
      );

    const isSuccess = Boolean(erc721Address && datatokenAddress && txHash);
    if (!isSuccess) throw new Error('No Token created. Please try again.');

    return { erc721Address, datatokenAddress };
  } catch (error) {
    console.error('[publish] createFun error', error.message);
    if (error.message.length > 65) {
      error.message = 'No Token created. Please try again.';
    }
  }
}

async function publish(values, ddo, ddoEncrypted) {
  try {
    if (!ddo || !ddoEncrypted)
      throw new Error('No DDO received. Please try again.');
    const controller = new AbortController();
    const res = await setNFTMetadataAndTokenURI(
      ddo,
      accountId,
      Web3,
      values.metadata.nft,
      controller.signal
      // abortController()
    );
    if (!res.transactionHash)
      throw new Error(
        'Metadata could not be written into the NFT. Please try again.'
      );

    return ddo;
  } catch (error) {
    console.error('[publish] publishfun error', error.message);
  }
}

async function encrypt(values, erc721Address, datatokenAddress) {
  try {
    if (!datatokenAddress || !erc721Address)
      throw new Error('No NFT or Datatoken received. Please try again.');
    const ddo = await transformPublishFormToDdo(
      values,
      datatokenAddress,
      erc721Address
    );
    if (!ddo) throw new Error('No DDO received. Please try again.');
    const Ddo = {
      '@context': ['https://w3id.org/did/v1'],
      id: 'did:op:276f108ce823578478a1754867b72dcefd1518c110302b3c814bbffe49eddee5',
      nftAddress: '0x0CEfCA7dEae32AC9C5699be9Ceb3Cd9Fee0D7754',
      version: '4.1.0',
      chainId,
      metadata: {
        created: '2022-10-29T11:17:31Z',
        updated: '2022-10-29T11:17:31Z',
        type: 'dataset',
        name: 'news',
        description: 'new Descrtipn',
        tags: ['new'],
        author: 'ICHIGO',
        license: 'https://market.oceanprotocol.com/terms',
        additionalInformation: {
          termsAndConditions: true,
        },
      },
      services: [
        {
          id: '85429bf78510c6005dbdb91627b85dadd0ae4e539655b85bd4440a05c9e6ca5d',
          type: 'access',
          files:
            '0x04fe6beffe72834c4f3158f6d3f31fdf9e7f89e22d3bbec18bc5b186a8610bbcb6f539aceeced83acf8d8cc8fff6317e449d4a567f3209a20f49dfcaadfe950c444f2a99cdc7b5f95fe5c36a76636417e0167d06eb2fa69544819a04231ccb5c2e9e40de27b1336bad1b4eb00c1aab9982e369fc716f02639ed08e9e2c726929a6d1d3987fe378e56dc1ab2a269c532d3e0d3aadc9bbfc29cc0bb20c4cd7c60cd3d1741801ac5b4135a14474ac709d9e1b29906c52346e4c849ef6936eeb34b9956becd98c7f637424709274f3635046835a67aba30e7aaf176c07df01b15bb2bbf0b5d24f95fed6f6b9abca2816b54bc9f4770e10c41f3ad4cabe27494c5a5723919d65c40bdb29c76c8efda9e63d11645b9e4734585c94fe451aebdee7cc0d6ba553a5ee0309f54ff15dfbaddd38e864c635d3729d1892a022455fcd2c5da8aa09de85c76bc5242ae0989ee43328570fa73c6149dc822aaf74063342fc60964796538967dfda1c474e8106e8bd1f2a0ac40d36f5cfc20070d577e96ec21d84f43ea6c660ad91ebc94ae73f595f49064e6a529168',
          datatokenAddress: '0x9712d2Acfc5A99a769a536981862054C7269A572',
          serviceEndpoint: 'https://v4.provider.goerli.oceanprotocol.com',
          timeout: 0,
        },
      ],
    };
    const controller = new AbortController();
    const ddoEncrypted = await ProviderInstance.encrypt(
      Ddo,
      values.services[0].providerUrl.url,
      controller.signal
      // abortController()
    );

    if (!ddoEncrypted)
      throw new Error('No encrypted DDO received. Please try again.');

    return { ddo, ddoEncrypted };
  } catch (error) {
    console.error('[publish] encrypyfun error', JSON.stringify(error));
  }
}

// Steps of publishing content 590
// PARAMETERS: _erc721Address,_datatokenAddress,_ddo,_ddoEncrypted,_did
export async function PUBLISHVIDEOS(web3, payload) {
  Web3 = web3;
  accountId = payload.user.accountId;
  const { erc721Address, datatokenAddress } = await create(payload);

  store.commit('SET_CURRENT_TRANSACTION_STEP', 2);

  const { ddo, ddoEncrypted } = await encrypt(
    payload,
    erc721Address,
    datatokenAddress
  );

  store.commit('SET_CURRENT_TRANSACTION_STEP', 3);

  await publish(payload, ddo, ddoEncrypted);
  return ddo;
}

export async function getPrice(exchangeId) {
  var oceanNeeded = await fixedRateExchange.getRate(exchangeId);
  return oceanNeeded;
}
