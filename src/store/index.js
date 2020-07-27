import Vue from 'vue'
import Vuex from 'vuex'

// import modules
import landingBanner from './modules/landingBanner';
import rank from './modules/rank';
import search from './modules/search';
import imageCache from './modules/imageCache';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        landingBanner,
        rank,
        search,
        imageCache
    }
})