<template>
  <div class="container">
    <div class="top">
      <h1 class="title vivify shake">Type Game</h1>
      <h2 class="subtitle">输入字母，看看你的速度有多快 :)</h2>
      <div class="github">
        <a href="http://zoutianwei.github.io"
          ><img src="./assets/github.png" alt="github"
        /></a>
      </div>
      <div class="status">
        <p
          class="msg"
          :class="{ 'vivify spin duration-1000': upperCaseCurr === '完成' }"
        >
          {{ upperCaseCurr }}
        </p>
      </div>
      <div class="game">
        <input
          type="text"
          class="game-input"
          v-model="inputVal"
          placeholder="在这里输入"
          @keydown="handleKeyup"
          ref="refInput"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <div
          class="game-reset"
          :class="{ 'vivify spin duration-1000': rotate }"
          @click="
            handleReset();
            handleRotate();
          "
        >
          Reset
        </div>
      </div>
      <div class="mode">
        <el-switch
          v-model="isShuffle"
          active-color="#2ec4b6"
          inactive-color="#e71d46"
          active-text="随机"
          inactive-text="顺序"
        >
        </el-switch>
      </div>
      <el-button type="warning" @click="handleTopBtn">排行榜 🏆</el-button>
      <div
        class="timer"
        :class="{ 'shake-little shake-constant': records.length }"
      >
        时间: <span class="">{{ showTime ? showTime : "0.000" }}</span
        >s
      </div>
      <transition
        enter-active-class="vivify driveInTop duration-500"
        leave-active-class="vivify driveOutTop duration-500"
      >
        <div class="result" v-if="records.length">
          <p>成绩 🏁</p>
          <ul>
            <li v-for="(v, i) in records" :key="`records-${i}`">
              <span>{{ v.display }}: </span> <span>{{ v.currTime }}s</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="bottom">
      <p>{{ date }}</p>
    </div>
  </div>
  <div class="dialog-new">
    <el-dialog title="记录一下" v-model="newRecVisible" width="80%" center>
      <div class="wrap">
        <div style=" margin-bottom:10px">
          {{ isShuffle ? "随机" : "顺序" }}模式
        </div>
        <div style="">本次成绩: {{ showTime }}s</div>
        <el-form :model="newRecForm" ref="newRecForm">
          <el-form-item
            prop="newPlayerName"
            :rules="[
              {
                required: true,
                message: '名字不能为空',
              },
              {
                max: 5,
                message: '名字不能超过5个字符',
              },
            ]"
          >
            <el-input
              v-model="newRecForm.newPlayerName"
              placeholder="请输入你的名字"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newRecVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitRec('newRecForm')"
            :loading="submitLoading"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div class="dialog-top">
    <el-dialog
      title="排行榜"
      v-model="topRecVisible"
      width="90%"
      max-width="100px"
      center
      lock-scroll
      @close="formLoading = false"
    >
      <div style="text-align: right">
        <el-switch
          v-model="showShuffle"
          active-color="#2ec4b6"
          inactive-color="#e71d46"
          active-text="随机"
          inactive-text="顺序"
        >
        </el-switch>
      </div>
      <el-table
        :data="showTopRec"
        :default-sort="{ prop: 'record' }"
        height="50vh"
        v-loading="formLoading"
      >
        <el-table-column type="index" label="排名"> </el-table-column>
        <el-table-column
          property="playerName"
          label="玩家名称"
        ></el-table-column>
        <el-table-column
          property="record"
          label="成绩"
          :formatter="formatRecord"
        ></el-table-column>
        <el-table-column
          property="createDate"
          label="记录日期"
          :formatter="formatcreateDate"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import request from "./api/index";
export default {
  name: "App",
  data() {
    return {
      inputVal: "",
      isShuffle: false, // 打乱顺序
      curr: "", // 当前的字母
      index: "", // 当前字母的index
      isLast: "", // 是否为最后一个字母
      alpha: "",
      timer: "", //页面时间显示的定时器
      showTime: 0, // 页面显示最后成绩时间
      startTime: "", //开始时间
      records: [],
      rotate: false, // 重置按钮动画
      date: "", // 页面底部日期
      newRecVisible: false, // 成绩输入modal
      topRecVisible: false,
      showShuffle: false, // 显示随机/顺序成绩单
      newRecForm: {
        newPlayerName: "",
      },
      topRec: [],
      formLoading: true,
      submitLoading: false,
    };
  },
  created() {
    this.getDate();
    this.alpha = this.createAlpha(this.isShuffle); // 闭包创建当前字母
    this.initAlpha();
  },
  mounted() {
    // 禁止粘贴
    this.$refs.refInput.onpaste = function() {
      return false;
    };
  },
  computed: {
    upperCaseCurr() {
      return this.curr.toUpperCase();
    },
    showTopRec() {
      const shuffled = this.topRec.filter((item) => item.isShuffle);
      const notShuffled = this.topRec.filter((item) => !item.isShuffle);
      return this.showShuffle ? shuffled : notShuffled;
    },
  },
  watch: {
    // 监听input更新的内容，如果不是字母就舍弃
    inputVal(newV, oldV) {
      // console.log('changed');
      if (this.inputVal) {
        // 当有值的时候判断，避开为空的情况
        const isAlphabet = /^[A-Za-z]+$/.test(newV);
        // console.log(isAlphabet);
        this.inputVal = isAlphabet ? newV : oldV;
      }
    },
    isShuffle(newV) {
      this.handleReset();
    },
    newRecVisible(newV) {
      setTimeout(() => {
        this.$refs.refInput.blur();
      }, 1);
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
      // console.log(e);
      //e.keyCode > 64 && e.keyCode < 91 // 不用keycode,解决ios 9宫格键盘问题
      if (/^[A-Za-z]+$/.test(e.key.toLowerCase())) {
        // 只有输入当前显示的字母才相应，其他无效
        if (e.key.toLowerCase() === this.curr) {
          const currTime = Date.now();
          // 如果当前是a那么就设置当前时间为开始时间, 并启启动定时器更新
          if (this.index === 0) {
            this.startTime = currTime;
            this.initTimer();
          }
          this.records.push({
            display: this.curr.toUpperCase(),
            currTime: ((currTime - this.startTime) / 1000).toFixed(3),
          });
          // 如果输入到z说明输入到最后一个字母，结束定时器
          if (this.isLast) {
            this.curr = "完成";
            clearInterval(this.timer);
            // 由于定时器存在时间差，最后一个数和显示的不统一，
            // 因此将最后的记录的结果赋值到页面上。
            this.showTime = this.records.slice(-1)[0].currTime;
            this.newRecVisible = true;
          } else {
            //用闭包生成下一个字母，并把它赋值到当前
            this.initAlpha();
          }
        } else {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    },
    handleReset() {
      this.inputVal = ""; // clear input
      this.alpha = null; // clear并重新创建闭包
      this.alpha = this.createAlpha(this.isShuffle);
      this.initAlpha();
      this.startTime = ""; // 置空开始时间和记录
      this.records = [];
      clearInterval(this.timer);
      this.showTime = 0;
      // this.$refs.refInput.focus();
    },
    initAlpha() {
      const { val, index, isLast } = this.alpha();
      this.curr = val;
      this.index = index;
      this.isLast = isLast;
    },
    createAlpha(isShuffle) {
      let index = 0;
      let list = [
        "a",
        "b",
        "c",
        "d",
        // "e",
        // "f",
        // "g",
        // "h",
        // "i",
        // "j",
        // "k",
        // "l",
        // "m",
        // "n",
        // "o",
        // "p",
        // "q",
        // "r",
        // "s",
        // "t",
        // "u",
        // "v",
        // "w",
        // "x",
        // "y",
        // "z",
      ];
      // 使用lodash随机打乱顺序
      list = isShuffle ? _.shuffle(list) : list;
      return () => {
        const val = list[index];
        const isLast = index >= list.length - 1;
        return { val, index: index++, isLast };
      };
    },
    handleRotate: _.throttle(function() {
      this.rotate = true;
      setTimeout(() => {
        this.rotate = false;
      }, 1000);
    }, 1000),
    getDate() {
      this.$moment.locale("zh-cn");
      this.date = this.$moment().format("yyyy年M月d日 h:mm:ss");
      setInterval(() => {
        this.date = this.$moment().format("yyyy年M月d日 h:mm:ss");
      }, 500);
    },
    submitRec(formName) {
      this.submitLoading = true
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const newRec = {
            playerName: this.newRecForm.newPlayerName,
            record: parseFloat(this.showTime),
            isShuffle: this.isShuffle,
            createDate: Date.now(),
          };
          await request.setNewRecord(newRec);
          this.submitLoading = false
          this.newRecVisible = false;
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    async handleTopBtn() {
      this.topRecVisible = true;
      this.topRec = await request.getTopList();
      this.formLoading = false;
      this.showShuffle = this.isShuffle;
    },
    // 格式化显示的表格成绩和日期字段
    formatRecord: (row) => row.record + "s",
    formatcreateDate(row) {
      return this.$moment(row.createDate).format("YY.MM.DD");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
.mode {
  ::v-deep(.el-switch__label) {
    color: #fff;
  }
  ::v-deep(.is-active) {
    color: #2ec4b6;
  }
}
.dialog-new {
  ::v-deep(.el-dialog) {
    max-width: 360px;
    .wrap {
      div {
        text-align: center;
        font-size: 20px;
      }
      div:nth-child(2) {
        margin-bottom: 10px;
      }
    }
  }
  ::v-deep(.el-dialog__body) {
    padding: 20px;
  }
  ::v-deep(.el-input__inner) {
    text-align: center;
  }
}
.dialog-top {
  ::v-deep(.el-dialog) {
    max-width: 400px;
  }
}
.dialog-top {
  ::v-deep(.is-active) {
    color: #2ec4b6;
  }
}
.dialog-top {
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
  }
}
</style>
<style>
html,
body,
#app {
  height: 100%;
  background: #011627;
}
</style>
