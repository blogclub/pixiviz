<template>
  <transition name="downloadqr-fade">
    <div
      class="downloadqr-wrapper"
      @click.self="handleWrapperClicked"
      v-if="show"
    >
      <div class="downloadqr">
        <div class="downloadqr-code" v-html="code"></div>
        <div class="downloadqr-tip">
          <span>请使用手机扫描二维码下载图片</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import QRCode from "qrcode-svg";

export default {
  data() {
    return {
      show: false,
      url: "https://pixiviz.pwp.app/",
    };
  },
  computed: {
    code() {
      return new QRCode(this.url).svg();
    },
  },
  methods: {
    open() {
      this.show = true;
      let url = window.location.href;
      if (window.location.href.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      url += "mobileDownload=true";
      this.url = url;
    },
    handleWrapperClicked() {
      this.show = false;
    },
  },
};
</script>