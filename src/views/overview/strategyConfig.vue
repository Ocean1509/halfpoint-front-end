<template>
  <div>
    <div class="container">
      <p class="typename">自营账户</p>
      <el-table
        :data="selrunA"
        border
        style="width: 100%"
        class="account-table"
      >
        <el-table-column prop="account" label="账户"> </el-table-column>
        <el-table-column
          :prop="head"
          :label="head"
          v-for="(head, i) in headconfig"
          :key="head + i"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[head] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container">
      <p class="typename">产品账户</p>
      <el-table :data="fundA" border style="width: 100%" class="account-table">
        <el-table-column prop="account" label="账户"> </el-table-column>
        <el-table-column
          :prop="head"
          :label="head"
          v-for="(head, i) in headconfig"
          :key="head + i"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[head] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container">
      <p class="typename">MOM账户</p>
      <el-table :data="momA" border style="width: 100%" class="account-table">
        <el-table-column prop="account" label="账户"> </el-table-column>
        <el-table-column
          :prop="head"
          :label="head"
          v-for="(head, i) in headconfig"
          :key="head + i"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[head] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="仓位配置修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="form"
        class="config-container"
      >
        <el-form-item v-for="f in headconfig" :key="f" :label="f">
          <el-input v-model="form[f]" class="config-input"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStrategyConf,
  accountLists,
  getStrategyList,
  updateStrategyConf,
} from "@/api/common";
import { MessageBox, Message } from 'element-ui'

export default {
  name: "strategy-config",
  methods: {
    handleClose() {
      this.form = {};
      this.trade_id = ''
      this.dialogVisible = false;
    },
    handleClick(rows) {
      this.dialogVisible = true;
      let obj = {};
      this.headconfig.forEach((h) => {
        console.log(h);
        obj[h] = rows[h] || "0";
      });
      this.trade_id = rows.account
      this.form = obj;
    },
    updateAccount() {
      return accountLists().then((res) => {
        const selfrun = [];
        const fun = [];
        const mom = [];
        const backtest = [];
        for (const account of res) {
          const type = account.type;

          switch (type) {
            case "SELFRUN":
              selfrun.push(account);
              break;
            case "FUND":
              fun.push(account);
              break;
            case "MOM":
              mom.push(account);
              break;
            case "BACKTEST":
              backtest.push(account);
              break;
            default:
              break;
          }
        }
        this.$store.commit("common/SET_ACCOUNT", {
          account: selfrun,
          type: "SELFRUN",
        });
        this.$store.commit("common/SET_ACCOUNT", {
          account: fun,
          type: "FUND",
        });
        this.$store.commit("common/SET_ACCOUNT", { account: mom, type: "MOM" });
        this.$store.commit("common/SET_ACCOUNT", {
          account: backtest,
          type: "BACKTEST",
        });
      });
    },
    getConfig() {
      getStrategyConf().then((res) => {
      const accounts = this.$store.state.common.account;
      const selrunA = accounts.SELFRUN;
      const fundA = accounts.FUND;
      const momA = accounts.MOM;

      const selrunAId = selrunA.map((a) => a.trade_id);
      const fundAId = fundA.map((a) => a.trade_id);
      const momAId = momA.map((a) => a.trade_id);

      const result = {
        selrunA: {},
        fundA: {},
        momA: {},
      };
      res.forEach((e) => {
        if (selrunAId.includes(e.trade_id)) {
          if (!result.selrunA[e.trade_id]) {
            result.selrunA[e.trade_id] = {};
          }
          result.selrunA[e.trade_id][e.strategy] = e.coefficient;
        }
        if (fundAId.includes(e.trade_id)) {
          if (!result.fundA[e.trade_id]) {
            result.fundA[e.trade_id] = {};
          }
          result.fundA[e.trade_id][e.strategy] = e.coefficient;
        }
        if (momAId.includes(e.trade_id)) {
          if (!result.momA[e.trade_id]) {
            result.momA[e.trade_id] = {};
          }
          result.momA[e.trade_id][e.strategy] = e.coefficient;
        }
      });
      console.log(result.selrunA);
      this.selrunA = Object.keys(result.selrunA).map((a) => ({
        ...result.selrunA[a],
        account: a,
      }));
      this.fundA = Object.keys(result.fundA).map((a) => ({
        ...result.fundA[a],
        account: a,
      }));
      this.momA = Object.keys(result.momA).map((a) => ({
        ...result.momA[a],
        account: a,
      }));
    });
    },
    submit() {
      console.log(this.form);
      updateStrategyConf({ data: this.form, trade_id: this.trade_id })
        .then((res) => {
          if (res.success) {
            this.$message({
              message: '仓位配置修改成功',
              type: 'success'
            });
          }
          this.getConfig()
        })
        .catch((err) => {
          Message({
            message: err.message || err,
            type: "error",
            duration: 5 * 1000,
          });
        })
        .finally(() => {
          this.dialogVisible = false;
        });
    },
  },
  data() {
    return {
      labelPosition: "right",
      selrunA: [],
      fundA: [],
      momA: [],
      headconfig: [],
      form: {},
      dialogVisible: false,
    };
  },
  async mounted() {
    await this.updateAccount();
    let res = await getStrategyList();
    this.headconfig = res;
    await this.getConfig()
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 1100px;
}
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

.config-container {
  margin-right: 40px;
}
</style>
