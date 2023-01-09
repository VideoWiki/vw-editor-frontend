import { onConnect, onDisconnect, web3 } from '../blockchain/connectWallet';
import axios from 'axios';
import store from './store';
import { downloadFile, getAccessDetails, order } from '../blockchain/Download';
import { PUBLISHVIDEOS } from '../blockchain/OceanMarket';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import constants from '../../constant';

const actions = {
  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width);
  },

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit('UPDATE_STARRED_PAGE', payload);
  },

  // The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_LIMITED', list);
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_MORE', list);
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY');
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val);
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    commit('UPDATE_USER_INFO', payload);
  },
  async connectWallet({ commit }) {
    try {
      await onConnect();
    } catch (err) {
      console.log(err);
    }
  },

  async disconnectWallet({ commit }) {
    try {
      await onDisconnect();
      commit('DISCONNECT');
    } catch (err) {
      console.log(err);
    }
  },
  async getDownloadStatus({ commit }, payload) {
    const newCancelToken = axios.CancelToken.source();
    const token = newCancelToken.token;
    try {
      const response = await axios.get(
        `https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/${payload.did}`,
        { token }
      );
      if (!response || response.status !== 200 || !response.data) return;

      var data = { ...response.data };
      const accessDetails = await getAccessDetails(
        data.chainId,
        data.services[0].datatokenAddress,
        data.services[0].timeout,
        payload.accountAddress
      );
      data = {
        ...data,
        accessDetails,
      };
      store.commit('SET_ASSET', data);
      if (data.accessDetails.validOrderTx) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(error.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async publishToOcean({ commit }, payload) {
    try {
      payload.user.accountId = store.state.accountAddress;
      const videoTxData = await PUBLISHVIDEOS(web3, payload);
      commit('studio/setTxData', videoTxData);
      return true;
    } catch (e) {
      console.log('Oh noooo', e);
      return false;
    }
  },
  async initiateBuy({ commit }, exchangeId) {
    try {
      await order(web3, store.state.asset, store.state.accountAddress);
    } catch (e) {
      console.log({ buyContentError: e });
      throw e;
    }
  },
  async startDownload({ commit }, payload) {
    try {
      await downloadFile(
        web3,
        store.state.asset,
        store.state.accountAddress,
        store.state.asset.accessDetails.validOrderTx
      );
    } catch (e) {
      console.log({ downloadContentErro: e });
      throw e;
    }
  },
  // async getIpfsUrl(
  //   client,
  //   ffmpeg,
  //   { video, title, description, speed, name, walletAddress, avatar }
  // ) {
  //   console.log('Payload', video);
  //   ffmpeg.FS('writeFile', 'inputFile.mp4', await fetchFile(video));

  //   // Run the FFMpeg command
  //   await ffmpeg.run(
  //     '-i',
  //     'inputFile.mp4',
  //     '-preset',
  //     'ultrafast',
  //     // "-t",
  //     // "5", // fragment duration second
  //     '-ss',
  //     '0.0',
  //     '-filter_complex',
  //     `[0:v]setpts=${1 / speed}*PTS[v];[0:a]atempo=${speed}[a]`,
  //     '-map',
  //     '[v]',
  //     '-map',
  //     '[a]',
  //     '-deadline',
  //     'realtime',
  //     '-cpu-used',
  //     '8',
  //     '-f',
  //     'mp4',
  //     'encoded.mp4'
  //   );

  //   // Read the result
  //   const data = ffmpeg.FS('readFile', 'encoded.mp4');
  //   // Create a URL
  //   const metadata = { title, description, name, walletAddress, avatar };
  //   const blob = new Blob([JSON.stringify(metadata)], {
  //     type: 'application/json',
  //   });
  //   const metadataFile = new File([blob], 'metadata.json');
  //   const BLOB = new Blob([data.buffer], { type: 'video/mp4' });
  //   const file = new File([BLOB], 'PREVIEW.mp4');
  //   const imgCID = await client.put([file, metadataFile], { name: file.name });
  //   return `https://${imgCID}.ipfs.w3s.link/`;
  // },

  async getIpfsUrl(
    client,
    { video, title, description, speed, name, walletAddress, avatar }
  ) {
    try {
      const res = await axios.post(
        constants.apiUrl + '/api/speed_up_video/',
        video
      );
      console.log(res.data.data, imgCID);
      const response = await fetch(res.data.data.video_url);
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const file = new File([blob], 'PREVIEW.mp4', { contentType });
      console.log(file);
      const metadata = { title, description, name, walletAddress, avatar };
      const BLOB = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      const metadataFile = new File([BLOB], 'metadata.json');
      const imgCID = await client.put([file, metadataFile], {
        name: file.name,
      });
      return `https://${imgCID}.ipfs.w3s.link/`;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async load({ commit }, payload) {
    // const ffmpeg = createFFmpeg({ log: true });
    // await ffmpeg.load();
    const client = await new Web3Storage({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYxZUMxQTlhMDc5NDNlQjBjMTcwQWZhMjcxNTY4MTg4NDA5YzAyRWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzA5NDQ2OTA5MjUsIm5hbWUiOiJiZWx1Z2EifQ.A2JdUCF0vKXJXGlaTKJ1pBNIDLT2MWa4m8OGHpCWfIA',
    });
    console.log('calling ');
    const RES = await actions.getIpfsUrl(client, payload);
    console.log('Res', RES);
    return RES;
  },
};

export default actions;
