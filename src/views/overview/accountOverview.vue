<template>
  <div>
    <div class="container" v-if="$route.meta.sub">
      <p class="typename">{{ typeName }}</p>
      <el-card class="box-card">
        <h4>静态数据</h4>

        <el-table
          :data="accounts"
          border
          style="width: 100%"
          class="account-table"
        >
          <el-table-column prop="trade_id" label="账户" width="180">
          </el-table-column>
          <el-table-column prop="yield" label="日收益率">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.yield > 0,
                  'color-down': scope.row.yield < 0,
                }"
                >{{ toPercent(scope.row.yield) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="backtest" label="回测">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.backtest > 0,
                  'color-down': scope.row.backtest < 0,
                }"
                >{{ toPercent(scope.row.backtest) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="day_return" label="日收益">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.day_return > 0,
                  'color-down': scope.row.day_return < 0,
                }"
                >{{ scope.row.day_return }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="drawdown" label="当前回撤"><template slot-scope="scope">{{toPercent(scope.row.drawdown)}}</template></el-table-column>
          <el-table-column prop="mdd" label="最大回撤"><template slot-scope="scope">{{toPercent(scope.row.mdd)}}</template></el-table-column>
          <el-table-column prop="pos" label="策略仓位"><template slot-scope="scope">{{toPercent(scope.row.pos)}}</template></el-table-column>
          <el-table-column prop="net_pos" label="净仓位">
            <template slot-scope="scope">{{toPercent(scope.row.net_pos)}}</template>
          </el-table-column>
          <el-table-column prop="long_pos" label="多头仓位">
            <template slot-scope="scope">{{toPercent(scope.row.long_pos)}}</template>
          </el-table-column>
          <el-table-column prop="short_pos" label="空头仓位">
            <template slot-scope="scope">{{toPercent(scope.row.short_pos)}}</template>
          </el-table-column>
          <el-table-column prop="nav" label="当前净值"> </el-table-column>
          <el-table-column prop="max_nav" label="最大净值"> </el-table-column>
          <el-table-column prop="slipp" label="日滑点"><template slot-scope="scope">{{toPercent(scope.row.slipp)}}</template></el-table-column>

          <el-table-column prop="balance" label="期货账户权益" width="120">
          </el-table-column>
          <el-table-column prop="saving" label="理财资金"> </el-table-column>
          <el-table-column prop="total" label="总权益"> </el-table-column>
        </el-table>
      </el-card>

      <el-card class="box-card" v-if="type !== 'MOM' && type !== 'BACKTEST'">
        <h4>动态数据</h4>

        <el-table
          :data="accounts"
          border
          style="width: 100%"
          class="account-table"
        >
          <el-table-column prop="trade_id" label="账户" width="180"></el-table-column>
          <el-table-column prop="r_total" label="实时总权益">
            <template slot-scope="scope">
              <!-- <span
                :class="{
                  'color-rise': scope.row.r_total > 0,
                  'color-down': scope.row.r_total < 0,
                }"
                >{{ scope.row.r_total }}</span
              > -->
              <span>{{ scope.row.r_total }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="r_return" label="实时收益">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.r_return > 0,
                  'color-down': scope.row.r_return < 0,
                }"
                >{{ scope.row.r_return }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="r_yield" label="实时收益率">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.r_yield > 0,
                  'color-down': scope.row.r_yield < 0,
                }"
                >{{ toPercent(scope.row.r_yield) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="r_margin" label="实时保证金比例">
            <template slot-scope="scope">
              <span>{{ toPercent(scope.row.r_margin) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="r_updatetime" label="更新时间">
            <template slot-scope="scope">
              <span>{{ transTimestamp(scope.row.r_updatetime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-if="$route.meta.tradeId" class="container">
      <accountDetail :subAccounts="subAccounts"></accountDetail>
    </div>
  </div>
</template>
<script>
import { accountLists } from "@/api/common";
import accountDetail from "@/views/overview/accountDetail.vue";

export default {
  name: "AccountOverview",
  components: {
    accountDetail,
  },
  methods: {
    toPercent(point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    transTimestamp(datetime, dateSeprator = '-', timeSeprator = ':') {
      console.log(datetime)
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
    formateDetail(fmt = 'YYYY-mm-dd HH:MM:SS', t) {
      let date = new Date(t)
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": (date.getHours() - 8).toString(), // 时
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
  },
  computed: {
    type() {
      return this.$route.name;
    },
    typeName() {
      switch (this.type) {
        case "SELFRUN":
          return "自营账户";
        case "FUND":
          return "产品账户";
        case "MOM":
          return "MOM账户";
        case "BACKTEST":
          return "回测";
        default:
          return "";
      }
    },
    accounts() {
      return this.$store.state.common.account[this.type] || [];
    },
    subAccounts() {
      let type = this.$route.meta && this.$route.meta.parent;
      if (!type) return [];
      let accounts = this.$store.state.common.account[type] || [];
      return accounts.find((val) => {
        return val.trade_id === this.type;
      });
    },
  },
};
</script>
<style lang="scss">
.typename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 40px;
}
.account-table .has-gutter {
  th {
    color: #000;
  }
}
h4 {
  margin-top: 0
}
</style>
