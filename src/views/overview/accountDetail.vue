<template>
  <div>
    <p class="typename">{{ subAccounts.trade_id }}</p>
    <el-card class="box-card account-data">
      <h4>账户数据</h4>
      <div class="account-data1">
        <p>
          实时总权益:
          <span
            class=""
            :class="{
              'color-rise': subAccounts.r_total > 0,
              'color-down': subAccounts.r_total < 0,
            }"
            >{{ subAccounts.r_total }}</span
          >
        </p>
        <p>
          实时收益:
          <span
            class="span"
            :class="{
              'color-rise': subAccounts.r_return > 0,
              'color-down': subAccounts.r_return < 0,
            }"
            >{{ subAccounts.r_return }}</span
          >
        </p>
        <p>
          实时收益率:
          <span
            class="span"
            :class="{
              'color-rise': subAccounts.r_yield > 0,
              'color-down': subAccounts.r_yield < 0,
            }"
            >{{ toPercent(subAccounts.r_yield) }}</span
          >
        </p>
        <p>
          实时保证金比例:
          <span
            class="span"
            :class="{
              'color-rise': subAccounts.r_margin > 0,
              'color-down': subAccounts.r_margin < 0,
            }"
            >{{ toPercent(subAccounts.r_margin) }}</span
          >
        </p>
      </div>
      <div class="account-data2">
        <div>
          <!-- <p>
            当前净值: <span class="span">{{ subAccounts.nav }}</span>
          </p> -->
          <!-- <p>
            最高净值: <span class="span">{{ subAccounts.max_nav }}</span>
          </p> -->
          <p>
            年化收益率: <span class="span">{{ toPercent(subAccounts.ay) }}</span>
          </p>
          <p>
            最大回撤: <span class="span">{{ toPercent(subAccounts.mdd) }}</span>
          </p>
          <!-- <p>
            当前回撤: <span class="span">{{ subAccounts.drawdown }}</span>
          </p> -->
          <p>
            收益回撤比: <span class="span">{{ subAccounts.cr }}</span>
          </p>
          <p>
            夏普: <span class="span">{{ subAccounts.sharp }}</span>
          </p>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <h4>历史数据</h4>
      <div style="margin-right: 26px; text-align: right">
        <el-date-picker
          v-model="times"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="search"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <div style="height: 400px">
        <line-chart :options="options"></line-chart>
      </div>
      <div>
        <el-table
          :data="daystats"
          border
          max-height="600"
          style="width: 100%;font-size: 12px;"
          class="account-table"
        >
          <template slot="empty">
            <div
              style="
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span class="nodata"></span>
            </div>
          </template>
          <el-table-column prop="date" label="日期" width="100">
            <template slot-scope="scope">
              {{ formate(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="yields" label="日收益率">
            <template slot-scope="scope">
              {{ toPercent(scope.row.yields) }}
            </template>
          </el-table-column>
          <el-table-column prop="backtest" label="回测">
            <template slot-scope="scope">
              {{ scope.row.backtest }}
            </template>
          </el-table-column>
          <el-table-column prop="margin" label="保证金比例" width="110">
            <template slot-scope="scope">
              {{ toPercent(scope.row.margin) }}
            </template>
          </el-table-column>
          <el-table-column prop="pos" label="策略仓位">
            <template slot-scope="scope">
              {{ toPercent(scope.row.pos) }}
            </template>
          </el-table-column>
          <el-table-column prop="net_pos" label="净仓位">
            <template slot-scope="scope">
              {{ toPercent(scope.row.net_pos) }}
            </template>
          </el-table-column>
          <el-table-column prop="long_pos" label="多头仓位">
            <template slot-scope="scope">
              {{ toPercent(scope.row.long_pos) }}
            </template>
          </el-table-column>
          <el-table-column prop="short_pos" label="空头仓位">
            <template slot-scope="scope">
              {{ toPercent(scope.row.short_pos) }}
            </template>
          </el-table-column>

          <el-table-column prop="net_worth" label="当前净值">
          </el-table-column>
          <el-table-column prop="highest_net_worth" label="最高净值">
          </el-table-column>
          <el-table-column prop="drawdown" label="当前回撤">
            <template slot-scope="scope">
              {{ toPercent(scope.row.drawdown) }}
            </template>
          </el-table-column>
          <el-table-column prop="day_return" label="日收益" min-width="100"> </el-table-column>
          <el-table-column prop="commission" label="手续费" min-width="100"> </el-table-column>
          <el-table-column prop="slip" label="滑点"> </el-table-column>
          <el-table-column prop="slipp" label="滑点比例">
            <template slot-scope="scope">
              {{ toPercent(scope.row.slipp) }}
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="账户权益" min-width="100"> </el-table-column>
          <el-table-column prop="deposit" label="当日入金" min-width="80"> </el-table-column>
          <el-table-column prop="withdraw" label="当日出金" min-width="80"> </el-table-column>
          <el-table-column prop="saving" label="理财资金" min-width="100"> </el-table-column>
          <el-table-column prop="total" label="总权益" min-width="100"> </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- <el-card class="box-card" v-if="subAccounts.type !== 'BACKTEST'">
      <h4>仓位配置</h4>
      <div class="strategycard">
        <div v-for="l in strategyLists" :key="l.key">
          {{ l.key }}: <span>{{ l.value }}</span
          ><el-button type="text" class="btn-modify" @click="modifystrategy(l)"
            >修改</el-button
          >
        </div>
      </div>
    </el-card> -->
    <el-card class="box-card" v-if="subAccounts.type !== 'MOM'">
      <h4>品种盈亏</h4>
      <div style="margin-right: 26px; text-align: right">
        <el-date-picker
          v-model="commTimes"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="searchCommProfit"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <div class="commTable">
          <el-table
            :data="commsProfit"
            border
            width="100%"
            class="account-table"
          >
            <template slot="empty">
              <div
                style="
                  height: 200px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <span class="nodata"></span>
              </div>
            </template>
            <el-table-column
              prop="comm"
              label="品种"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="profit"
              label="盈亏"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="subAccounts.type !== 'MOM'">
      <h4>实时仓位</h4>
      <div class="ps-table">
        <el-table
          :data="psData"
          border
          width="100%"
          max-height="400px"
          class="account-table"
        >
          <template slot="empty">
            <div
              style="
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span class="nodata"></span>
            </div>
          </template>
          <el-table-column
            prop="timestamp"
            label="时间"
            header-align="center"
            align="center"
          >
          <template slot-scope="scope">
            <div>
              {{transTimestamp(scope.row.timestamp)}}
            </div>
          </template>
          </el-table-column>
          <el-table-column
            prop="comm"
            label="品种"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="lowfreq"
            label="低频仓位"
            header-align="center"
            v-if="subAccounts.type !== 'BACKTEST'"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="midfreq"
            label="中频仓位"
            v-if="subAccounts.type !== 'BACKTEST'"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="actual"
            label="实际仓位"
            v-if="subAccounts.type !== 'BACKTEST'"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="ps"
            label="仓位"
            v-if="subAccounts.type === 'BACKTEST'"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="" label="">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="history(scope.row)"
                >历史</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      title="仓位配置修改"
      :visible.sync="modifyDialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="modifyStrategyConfig"
        class="config-container"
      >
        <el-form-item :label="modifyStrategyConfig.label">
          <el-input
            v-model="modifyStrategyConfig.value"
            class="config-input"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="historyDialogShow"
      width="770px"
      style="padding-bottom: 50px"
      :before-close="handleHistoryClose"
    >
      <div style="height: 500px; width: 700px">
        <div class="block" style="padding: 0 70px">
          <el-slider v-model="limit" @change="changelimit" show-input>
          </el-slider>
        </div>
        <div style="margin-bottom: 10px; width: 700px; height: 400px">
          <line-chart
            :options="historyOptions"
            v-if="historyDialogShow"
          ></line-chart>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDayStats,
  getStrategyList,
  getStrategyConf,
  updateStrategyConf,
  getCommsProfit,
  getContractConfig,
  getPs,
  getPsTimeStamp,
  getHistory,
  getPshistorybasktest,
  getBacktestHistory
} from "@/api/common";
import lineChart from "@/views/overview/lineChart";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

export default {
  name: "accountdetail",
  props: ["subAccounts"],
  components: {
    lineChart,
  },
  computed: {
    ispsshow() {
      return (
        (this.subAccounts.type === "SELFRUN" ||
          this.subAccounts.type === "FUND") &&
        ![
          "xinghuo1_mix",
          "xinghuo1_lofreq",
          "jinqu1_mix",
          "jinqu1_lowfreq",
        ].includes(this.subAccounts.trade_id)
      );
    },
  },
  data() {
    return {
      limit: 30,
      labelPosition: "right",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      modifyDialog: false, // 仓位修改dialog
      daystats: [],
      times: [],
      commTimes: [],
      data: [],
      headconfig: [], // 仓位头部
      strategyLists: [],
      options: {
        tooltip: {
          //设置tip提示
          trigger: "axis",
        },

        // legend: {
        //   //设置区分（哪条线属于什么）
        //   data: ["当前净值"],
        // },
        color: ["#FA6F53"], //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          data: this.times,
          // name: "时间", //X轴 name
          nameTextStyle: {
            //坐标轴名称的文字样式
            color: "#FA6F53",
            fontSize: 16,
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: "#FA6F53",
            },
          },
        },
        yAxis: {
          // name: "SALES VOLUME",
          // nameTextStyle: {
          //   color: "#FA6F53",
          //   fontSize: 16,
          //   padding: [0, 0, 10, 0],
          // },
          axisLine: {
            lineStyle: {
              color: "#FA6F53",
            },
          },
          scale: true,
          type: "value",
        },
        series: [
          {
            name: "当前净值",
            data: this.data,
            type: "line",
            lineStyle: {
              normal: {
                color: "#FA6F53",
              },
            },
          },
        ],
      },
      historyOptions: {
        tooltip: {
          //设置tip提示
          trigger: "axis",
        },

        legend: {
          //设置区分（哪条线属于什么）
          // data: ["实际仓位"],
        },
        color: ["#FA6F53"], //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          data: this.times,
          // name: "时间", //X轴 name
          nameTextStyle: {
            //坐标轴名称的文字样式
            color: "#FA6F53",
            fontSize: 16,
            padding: [0, 20, 0, 20],
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: "#FA6F53",
            },
          },
          axisLabel: {
            formatter: (value, index) => {
              return value.split(' ')[0]
            }
          }
        },
        yAxis: {
          // name: "SALES VOLUME",
          // nameTextStyle: {
          //   color: "#FA6F53",
          //   fontSize: 16,
          //   padding: [0, 0, 10, 0],
          // },
          axisLine: {
            lineStyle: {
              color: "#FA6F53",
            },
          },
          scale: true,
          type: "value",
        },
        series: [
          {
            // name: "实际仓位",
            data: this.data,
            type: "line",
            lineStyle: {
              normal: {
                color: "#FA6F53",
              },
            },
          },
        ],
      },
      modifyStrategyConfig: {
        label: "",
        value: "",
      },
      commsProfit: [],
      psData: [],
      limit: 30,
      historyDialogShow: false,
      currentRow: {}
    };
  },
  methods: {
    toPercent(point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    transTimestamp(datetime, dateSeprator = '-', timeSeprator = ':') {
      if (datetime) {
        const date = new Date(datetime)
        const year = `${date.getUTCFullYear()}`
        let month = `${date.getUTCMonth() + 1}`
        let day = `${date.getUTCDate()}`
        let hour = `${date.getUTCHours()}`
        let minute = `${date.getUTCMinutes()}`
        let second = `${date.getUTCSeconds()}`

        if (month.length === 1) {
          month = `0${month}`
        }
        if (day.length === 1) {
          day = `0${day}`
        }
        if (day.length === 1) {
          day = `0${day}`
        }
        if (hour.length === 1) {
          hour = `0${hour}`
        }
        if (minute.length === 1) {
          minute = `0${minute}`
        }
        if (second.length === 1) {
          second = `0${second}`
        }
        return `${year}${dateSeprator}${month}${dateSeprator}${day} ${hour}${timeSeprator}${minute}${timeSeprator}${second}`
      }
    },
    async submit() {
      updateStrategyConf({
        data: {
          [this.modifyStrategyConfig.label]: this.modifyStrategyConfig.value,
        },
        trade_id: this.subAccounts.trade_id,
      })
        .then(async (res) => {
          if (res.success) {
            this.$message({
              message: "仓位配置修改成功",
              type: "success",
            });
          }
          // 仓位信息
          let sres = await getStrategyList();
          this.headconfig = sres;
          let strategyResult = {};
          let resp = await getStrategyConf({
            trade_id: this.$props.subAccounts.trade_id,
          });
          resp.forEach((e) => {
            strategyResult[e.strategy] = {
              key: e.strategy,
              value: e.coefficient,
            };
          });
          let tempsLists = Object.keys(strategyResult).map(
            (k) => strategyResult[k]
          );
          this.strategyLists = this.headconfig.map((k) => {
            return (
              tempsLists.find((t) => t.key === k) || { key: k, value: "0" }
            );
          });
        })
        .catch((err) => {
          Message({
            message: err.message || err,
            type: "error",
            duration: 5 * 1000,
          });
        })
        .finally(() => {
          this.handleClose();
        });
    },
    handleHistoryClose() {
      this.historyDialogShow = false;
    },
    handleClose() {
      this.modifyDialog = false;
      this.modifyStrategy = {
        label: "",
        value: "",
      };
    },
    modifystrategy(strategy) {
      this.modifyDialog = true;
      this.modifyStrategyConfig.label = strategy.key;
      this.modifyStrategyConfig.value = strategy.value;
    },
    formate(t) {
      let year = new Date(t).getFullYear();
      let month = new Date(t).getMonth() + 1;
      let date = new Date(t).getDate();
      return `${year}-${month}-${date}`;
    },
    formateDetail(fmt = 'YYYY-mm-dd HH:MM:SS', t) {
      let date = new Date(t)
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": (date.getHours()).toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    search(t) {
      getDayStats({
        trade_id: this.subAccounts.trade_id,
        startTimes: this.times[0],
        endTimes: this.times[1],
      }).then((res) => {
        let resp = [...res]
        let a1 = res.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        let b1 = resp.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        this.daystats = a1
        this.options.xAxis.data = b1.map((t) =>
          this.formate(t.date)
        );
        this.options.series[0].data = b1.map((t) => t.net_worth);
      });
    },
    searchCommProfit() {
      getCommsProfit({
        trade_id: this.subAccounts.trade_id,
        startTimes: this.commTimes[0].split(' ')[0],
        endTimes: this.commTimes[1].split(' ')[0],
      }).then((res) => {
        console.log(res)
        let obj = {};
        res.forEach((r) => {
          if (obj[r.comm]) {
            obj[r.comm].profit = Number(obj[r.comm].profit) + Number(r.profit);
          } else {
            obj[r.comm] = {
              comm: r.comm,
              profit: r.profit,
            };
          }
        });
        this.commsProfit = [];
        Object.keys(obj).forEach((o) => {
          this.commsProfit.push(obj[o]);
        });
        this.commsProfit.sort((pre, next) => {
          return next.profit - pre.profit
        })
      });
    },
    async getPstable() {
      try {
        let time = await getPsTimeStamp({
          trade_id: this.subAccounts.trade_id,
        });
        if (!time.length) return;
        let lastT = time[0].timestamp;
        let res;
        if (this.subAccounts.type === "BACKTEST") {
          res = await getPshistorybasktest({
            trade_id: this.subAccounts.trade_id,
            timestamp: lastT,
          });
        } else {
          res = await getPs({
            trade_id: this.subAccounts.trade_id,
            timestamp: lastT,
          });
        }
        this.psData = res;
      } catch (error) {
        console.log(error);
      }
    },
    async history(rows) {
      if (rows) {
        this.currentRow = rows
      }
      let res
      if (this.subAccounts.type === 'BACKTEST') {
          res = await getBacktestHistory({
            trade_id: this.subAccounts.trade_id,
            limit: this.limit,
            comm: this.currentRow.comm
          })
      } else {
          res = await getHistory({
            trade_id: this.subAccounts.trade_id,
            limit: this.limit,
            comm: this.currentRow.comm
          });
      }
      let resp = [...res]
      resp.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      this.historyOptions.xAxis.data = resp.map((t) =>
        // this.formate(t.timestamp)
        // this.formateDetail(undefined, t.timestamp)
        this.transTimestamp(t.timestamp)
      );
      this.historyOptions.series[0].data = resp.map((t) => t.actual || t.ps);
      this.historyDialogShow = true;
    },
    async changelimit() {
      this.history();
    },
  },
  async mounted() {
    let endTimes = this.formateDetail(undefined, new Date().getTime());
    // let endTimes = this.transTimestamp(new Date().getTime())
    let startTimes = this.transTimestamp(new Date(new Date().getFullYear() + "-01-01").getTime())

    console.log(startTimes, endTimes)
    this.times = [startTimes, endTimes];
    this.commTimes = [endTimes, endTimes];
    if (this.subAccounts.type !== 'MOM') {
      this.searchCommProfit();
    }
    getDayStats({
      trade_id: this.subAccounts.trade_id,
      startTimes,
      endTimes,
    }).then((res) => {
      let resp = [...res]
      let a1 = res.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      let b1 = resp.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      this.daystats = a1
      this.options.xAxis.data = b1.map((t) => this.formate(t.date));
      this.options.series[0].data = b1.map((t) => t.net_worth);
    });
    // 仓位信息
    let res = await getStrategyList();
    this.headconfig = res;
    let strategyResult = {};
    let resp = await getStrategyConf({
      trade_id: this.$props.subAccounts.trade_id,
    });
    resp.forEach((e) => {
      strategyResult[e.strategy] = {
        key: e.strategy,
        value: e.coefficient,
      };
    });
    let tempsLists = Object.keys(strategyResult).map((k) => strategyResult[k]);
    this.strategyLists = this.headconfig.map((k) => {
      return tempsLists.find((t) => t.key === k) || { key: k, value: "0" };
    });
    // 获取仓位信息
    if (this.subAccounts.type !== 'MOM') {
      this.getPstable();
      this.timeout = setInterval(() => {
        this.getPstable()
      }, 60000)
    }

  },
  beforeDestroy() {
    clearInterval(this.timeout)
  }
};
</script>
<style lang="scss">
.box-card {
  margin-bottom: 25px;
}
.strategycard {
  display: flex;
  justify-content: space-around;
}
.btn-modify {
  margin-left: 15px;
}
.config-container {
  margin-right: 40px;
}
.commTable {
  margin-top: 40px;
}
.account-data {
  .account-data1 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;

    margin: 0 30px;
  }
  .span {
    margin-left: 10px;
  }
  .account-data2 {
    margin: 20px 30px;
    > div {
      display: flex;
      p {
        width: 50%;
        text-align: center;
      }
    }
  }
}
</style>
