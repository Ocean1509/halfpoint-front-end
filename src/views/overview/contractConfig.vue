<template>
  <div>
    <div class="container">
      <p class="typename">合约配置</p>
      <el-table
        :data="configlists"
        border
        height="800"
        style="width: 100%"
        class="account-table"
      >
        <el-table-column
          :prop="head.key"
          :label="head.label"
          v-for="(head, i) in headconfig"
          :key="head + i"
        >
          <template slot-scope="scope" style="text-align:center">
            <span>{{ scope.row[head.key] || "" }}</span>
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
      title="手动设置合约"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="form"
        class="config-container"
      >
        <el-form-item :label="form.comm">
          <el-input v-model="form.manu" class="config-input"></el-input>
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
  getContractConfig, updateContractConfig
} from "@/api/common";
import { MessageBox, Message } from 'element-ui'

export default {
  name: "contract-config",
  methods: {
    handleClose() {
      this.form = {};
      this.trade_id = ''
      this.dialogVisible = false;
    },
    handleClick(rows) {
      this.dialogVisible = true;
      this.form = {
        comm: rows.comm,
        manu: rows.manu || ''
      };
    },
    getConfig() {

    },
    async submit() {
      updateContractConfig(this.form).then(res => {
        if (res.success) {
            this.$message({
              message: '手工设置合约成功',
              type: 'success'
            });
          }
          getContractConfig().then(res => {
            this.configlists = res;
          });
      }).catch(err => {
          Message({
            message: err.message || err,
            type: "error",
            duration: 5 * 1000,
          });
      }).finally(() => {
          this.dialogVisible = false;
      })
      // console.log(this.form);
      // updateStrategyConf({ data: this.form, trade_id: this.trade_id })
      //   .then((res) => {
      //     if (res.success) {
      //       this.$message({
      //         message: '仓位配置修改成功',
      //         type: 'success'
      //       });
      //     }
      //     this.getConfig()
      //   })
      //   .catch((err) => {
      //     Message({
      //       message: err.message || err,
      //       type: "error",
      //       duration: 5 * 1000,
      //     });
      //   })
      //   .finally(() => {
      //     this.dialogVisible = false;
      //   });
    },
  },
  data() {
    return {
      labelPosition: "center",
      configlists: [],
      headconfig: [{
        key: 'comm',
        label: '品种'
      }, {
        key: 'tianqin',
        label: '天勤'
      }, {
        key: 'juejin',
        label: '掘金'
      }, {
        key: 'manu',
        label: '人工'
      }],
      form: {},
      dialogVisible: false,
    };
  },
  async mounted() {
    let res = await getContractConfig();
    this.configlists = res;
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
.account-table {
  max-height: 800px;
  overflow-y: auto;
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
