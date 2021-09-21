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
                >{{ scope.row.yield }}</span
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
          <el-table-column prop="drawdown" label="当前回撤"> </el-table-column>
          <el-table-column prop="mdd" label="最大回撤"> </el-table-column>
          <el-table-column prop="pos" label="策略仓位"> </el-table-column>
          <el-table-column prop="net_pos" label="净仓位"> </el-table-column>
          <el-table-column prop="long_pos" label="多头仓位"> </el-table-column>
          <el-table-column prop="short_pos" label="空头仓位"> </el-table-column>
          <el-table-column prop="nav" label="当前净值"> </el-table-column>
          <el-table-column prop="max_nav" label="最大净值"> </el-table-column>
          <el-table-column prop="slipp" label="日滑点"> </el-table-column>

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
                >{{ scope.row.r_yield }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="r_margin" label="实时保证金比例">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.r_margin > 0,
                  'color-down': scope.row.r_margin < 0,
                }"
                >{{ scope.row.r_margin }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="r_total" label="实时总权益">
            <template slot-scope="scope">
              <span
                :class="{
                  'color-rise': scope.row.r_total > 0,
                  'color-down': scope.row.r_total < 0,
                }"
                >{{ scope.row.r_total }}</span
              >
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
