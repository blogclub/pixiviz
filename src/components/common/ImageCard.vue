<template>
  <div class="image-card-wrapper" :style="positionStyle">
    <a
      :href="loadError || block || !image ? 'javascript:;' : `/pic/${image.id}`"
      :class="['image-card', loadError || block ? 'image-card-status-error' : '']"
      :style="{width: cardWidth + 'px', height: loadHeight + 'px'}"
      @click.prevent="handleClick"
      >
      <div class="image-card-overlay image-card-block" v-if="block">
        <div class="image-card-overlay-icon" v-if="loadHeight >= 128">
          <i class="el-icon-warning-outline"/>
        </div>
        <div :class="['image-card-overlay-tip', loadHeight < 128 ? 'image-card-overlay-tip-xs': null]">
          <span>该图片无法展示</span>
        </div>
      </div>
      <div class="image-card-overlay image-card-error" v-if="loadError">
        <div class="image-card-overlay-icon" v-if="loadHeight >= 128">
          <i class="el-icon-warning-outline"/>
        </div>
        <div :class="['image-card-overlay-tip', loadHeight < 128 ? 'image-card-overlay-tip-xs': null]">
          <span>图片加载失败</span>
        </div>
      </div>
      <div class="image-card-count" v-if="image && image.page_count > 1">
        <img :src="countIcon"><span>{{image ? image.page_count : ''}}</span>
      </div>
      <div
        ref="image"
        class="image-card-image"
        :data-index="image ? image.index : ''"
        data-type="card"
        v-if="!block"
        v-loading="loading"
        v-lazy:background-image="source"
        >
      </div>
      <div class="image-card-title">
        {{image.title}}
      </div>
    </a>
  </div>
</template>

<script>
import CONFIG from '@/config.json'

export default {
  name: 'Common.ImageCard',
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
    imageType: {
      type: String,
      default: 'medium'
    },
    cardWidth: {
      type: Number,
      default: 100,
    },
    position: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    image: {
      immediate: true,
      handler(image) {
        this.loading = true;
        this.loadError = false;
        this.removeEvents();
        this.registerEvents();
      },
    },
  },
  data() {
    return {
      loading: false,
      loadError: false,
      block: this.image.x_strict ? true : this.image.sanity_level > 5 ? true : false,
      countIcon: require('@/assets/images/count.svg'),
    }
  },
  created() {
    this.registerEvents();
  },
  beforeDestroy() {
    this.removeEvents();
  },
  computed: {
    source() {
      if (this.block || !this.image) {
        return '';
      } else {
        let url = this.image.image_urls[this.imageType].replace('i.pximg.net', this.getHost());
        if (window.isSafari) {
          url = url.replace('_10_webp', '_70');
        }
        return url;
      }
    },
    positionStyle() {
      const top = this.position ? this.position.top : 0;
      const left = this.position ? this.position.left : 0;
      return {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      };
    },
    loadHeight() {
      if (!this.position) {
        return 0;
      }
      return this.position.height;
    },
    cardIdentifier() {
      if (!this.image) {
        return '';
      }
      return `${this.image.index}_${this.image.id}`;
    }
  },
  methods: {
    registerEvents() {
      this.$bus.$on(`image-loaded-card-${this.cardIdentifier}`, this.loadedHandler);
      this.$bus.$on(`image-error-card-${this.cardIdentifier}`, this.errorHandler);
    },
    removeEvents() {
      this.$bus.$off(`image-loaded-card-${this.cardIdentifier}`, this.loadedHandler);
      this.$bus.$off(`image-error-card-${this.cardIdentifier}`, this.errorHandler);
    },
    getHost() {
      if (window.pixiviz.proxyMap && window.pixiviz.hostMap && window.pixiviz.loadMap) {
        const hostLog = window.pixiviz.loadMap[this.image.id];
        if (typeof hostLog !== 'undefined' && hostLog !== null) {
					return window.pixiviz.hostMap[window.pixiviz.loadMap[this.image.id]] ||
						window.pixiviz.hostMap[0] ||
						CONFIG.IMAGE_PROXY_HOST;
        } else {
          const random = Math.random();
          const hosts = Object.keys(window.pixiviz.proxyMap);
          for (let host of hosts) {
            if (random >= window.pixiviz.proxyMap[host][0]
              && random < window.pixiviz.proxyMap[host][1]) {
              window.pixiviz.loadMap[this.image.id] = window.pixiviz.hostMap[host];
              return host;
            }
          };
        }
        return CONFIG.IMAGE_PROXY_HOST;
      } else {
        return CONFIG.IMAGE_PROXY_HOST;
      }
    },
    handleClick() {
      if (!this.block && !this.loadError) {
        this.$emit('clicked', this.image.id);
      }
    },
    loadedHandler() {
      this.loading = false;
      this.loadError = false;
      this.$forceUpdate();
    },
    errorHandler() {
      this.loading = false;
      this.loadError = true;
      this.$forceUpdate();
    }
  }
}
</script>
