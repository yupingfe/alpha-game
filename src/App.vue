<template>
  <div id="#app">
    <h1 class="title">Type The Alphabet</h1>
    <h2 class="subtitle">输入字母，看看你的速度有多快 :)</h2>
    <div class="github">
      <a href="http://zoutianwei.github.io"
        ><img src="./assets/github.png" alt="github"
      /></a>
    </div>
    <div class="status">
      <p class="msg">{{ upperCaseCurr }}</p>
    </div>
    <div class="game">
      <input
        type="text"
        class="game-input"
        v-model="inputVal"
        placeholder="在这里输入"
        @keydown="handleKeyup"
        ref="refInput"
      />
      <input
        type="submit"
        class="game-submit"
        value="重置"
        @click="handleReset"
      />
    </div>
    <div class="timer">时间：{{ showTime ? showTime : "0.000" }}s</div>
    <div class="result" v-show="records.length">
      <p>成绩 🏁</p>
      <ul>
        <li v-for="(v, i) in records" :key="`records-${i}`">
          <span>{{ v.display }}: </span> <span>{{ v.currTime }}s</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      inputVal: "",
      curr: "a", // 当前的字母
      alpha: this.createAlpha(), // 闭包创建当前字母
      timer: "", //页面时间显示的定时器
      showTime: 0, // 页面显示时间
      startTime: "", //开始时间
      records: [],
    };
  },
  computed: {
    upperCaseCurr() {
      return this.curr.toUpperCase();
    },
  },
  methods: {
    initTimer() {
      this.timer = setInterval(() => {
        this.showTime = ((Date.now() - this.startTime) * 0.001).toFixed(3);
      }, 1);
    },
    handleKeyup(e) {
      // 只有输入字母才有相应，其他按键无效
      if (e.keyCode > 64 && e.keyCode < 91) {
        // 只有输入当前显示的字母才相应，其他无效
        if (e.key === this.curr) {
          const currTime = Date.now();
          // 如果当前是a那么就设置当前时间为开始时间, 并启启动定时器更新
          if (e.key === "a") {
            this.startTime = currTime;
            this.initTimer();
          }
          this.records.push({
            display: this.curr,
            currTime: ((currTime - this.startTime) / 1000).toFixed(3),
          });
          // 如果输入到z说明输入到最后一个字母，结束定时器
          if (e.key === "z") {
            clearInterval(this.timer);
            // 由于定时器存在时间差，最后一个数和显示的不统一，
            // 因此将最后的记录的结果赋值到页面上。
            this.showTime = this.records.slice(-1)[0].currTime;
          }
          //用闭包生成下一个字母，并把它赋值到当前
          this.curr = this.alpha();
        } else {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    },
    handleReset() {
      this.inputVal = ""; // 置空 input
      this.curr = "a"; // 重设置当前字母为初始值a
      this.alpha = null; // 置空并重新创建闭包
      this.alpha = this.createAlpha();
      this.startTime = ""; // 置空开始时间和记录
      this.records = [];
      clearInterval(this.timer);
      this.showTime = 0;
      this.$refs.refInput.focus();
    },
    createAlpha() {
      let alpha = "a";
      return function () {
        switch (alpha) {
          case "a":
            alpha = "b";
            break;
          case "b":
            alpha = "c";
            break;
          case "c":
            alpha = "d";
            break;
          case "d":
            alpha = "e";
            break;
          case "e":
            alpha = "f";
            break;
          case "f":
            alpha = "g";
            break;
          case "g":
            alpha = "h";
            break;
          case "h":
            alpha = "i";
            break;
          case "i":
            alpha = "j";
            break;
          case "j":
            alpha = "k";
            break;
          case "k":
            alpha = "l";
            break;
          case "l":
            alpha = "m";
            break;
          case "m":
            alpha = "n";
            break;
          case "n":
            alpha = "o";
            break;
          case "o":
            alpha = "p";
            break;
          case "p":
            alpha = "q";
            break;
          case "q":
            alpha = "r";
            break;
          case "r":
            alpha = "s";
            break;
          case "s":
            alpha = "t";
            break;
          case "t":
            alpha = "u";
            break;
          case "u":
            alpha = "v";
            break;
          case "v":
            alpha = "w";
            break;
          case "w":
            alpha = "x";
            break;
          case "x":
            alpha = "y";
            break;
          case "y":
            alpha = "z";
            break;
          case "z":
            alpha = "完成";
            break;
          default:
            break;
        }
        return alpha;
      };
    },
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
