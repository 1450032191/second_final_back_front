<template>
  <div>
    <el-table
        :data="list"
        border
        style="width: 100%">
      <el-table-column
          prop="order_no"
          label="订单号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="pingjia_xin"
          label="星级"
          width="180">
      </el-table-column>
      <el-table-column
          prop="pingjia_text"
          label="内容">
      </el-table-column>
      <el-table-column
          prop="user_name"
          label="评论人">
      </el-table-column>
      <el-table-column
          prop="pingjia_time"
          label="评论时间">
      </el-table-column>
      <el-table-column
          prop="pingjia_time"
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" round type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
import axios from '@/api'
export default {
    name: "pingjia",
    data(){
        return{
          list: [
            // {
            //   id: 123,
            //   order_id: '',
            //   order_no: '',
            //   pingjia_time: '',
            //   pingjia_xin: '',
            //   pingjia_text: '',
            //   user_name: '',
            //   pingjia_status: '',
            // }
          ],
          pageIndex: 0,
          pageSize: 10,
          total: 0
        }
    },
  methods:{
      del(id){
        axios.post('admin/order/delPingjia.do?id='+id).then(res => {
          if(res.code == 1){
              this.$message.success('删除评论成功！')
              this.getList()
          }
        })
      },
    handleCurrentChange(val){
        this.pageIndex = val
        this.getList()
    },
      getList(){
        var {pageIndex,pageSize} = this
        axios.get('admin/order/getAllPingJia.do?pageIndex='+pageIndex+'&pageSize='+pageSize).then(res => {
          if(res.code == 1){
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      }
  },
  created() {
      this.getList()
  }
}
</script>

<style lang="scss">

</style>
