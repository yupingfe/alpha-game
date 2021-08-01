<template>
  <div id="#app">
    <h1 class="title">Type The Alphabet</h1>
    <h2 class="subtitle">输入字母，看看你的速度有多快 :)</h2>
    <div class="status">
      <p class="msg">完成!</p>
    </div>
    <div class="game">
      <input
        type="text"
        class="game-input"
        v-model="inputVal"
        placeholder="在这里输入"
        @keydown="handleKeyup"
      />
      <input
        type="button"
        class="game-submit"
        value="重置"
        @click="handleReset"
      />
    </div>
    <div class="timer">时间：0.000s</div>
    <div class="result">
      <p>成绩 🏁🏁🏁</p>
      <ul>
        <li>a: 0.000s</li>
        <li>a: 0.000s</li>
        <li>a: 0.000s</li>
        <li>a: 0.000s</li>
        <li>a: 0.000s</li>
        <li>a: 0.000s</li>
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
      curr: "a",
      foo: this.createAlpha(),
      reset: false,
    };
  },
  methods: {
    handleKeyup(e) {
      if (e.keyCode > 64 && e.keyCode < 91) {
        if (e.key === this.curr) {
          this.generate();
          console.log("curr: " + this.curr);
        } else {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    },
    handleReset() {
      this.inputVal = "";
      this.reset = true;
      this.generate();
    },
    generate() {
      if (this.reset) {
        this.curr = "a";
        this.foo = null;
        this.foo = this.createAlpha();
        this.reset = !this.reset;
      } else {
        this.curr = this.foo();
      }
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
            alpha = "z";
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
