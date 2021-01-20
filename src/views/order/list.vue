<template>
    <div id="user-list">
        <div class="search">
            <el-input class="search-key"
                      placeholder="请输入内容"
                      v-model="serachKey"
                      clearable>
            </el-input>
            <el-button style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="serach()">搜索</el-button>
            <el-button type="primary" @click="exportToExcel()">导出Excel</el-button>
        </div>

        <el-table
                :data="userList"
                border
                style="width: 100%" id="user-table">
            <el-table-column
                    prop="orderNo"
                    label="订单号"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="用户名"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="uaPhone"
                    label="收货电话"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="allSkuCount"
                    label="商品总数"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="skuAllPrice"
                    label="商品总价"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="订单状态"
                    align="center">
                <template slot-scope="scope">
                    <el-tag
                            type="success"
                            effect="dark">
                        {{ scope.row.statusText }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 2"
                            size="mini"
                            @click="deliver(scope.row.orderId)">发货</el-button>
                    <el-button v-if="scope.row.status == 3"
                            size="mini"
                            @click="end(scope.row.orderId)">结束订单</el-button>
                  <el-button size="mini"
                             @click="toDetail(scope.row.orderId)">详情</el-button>
<!--                    <el-button size="mini"-->
<!--                               @click="">详情</el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <div class="page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="pageChange"
                    :current-page="page.pageIndex + 1"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import axios from '@/api';
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    export default {
        name: "list.vue",
        data(){
            return {
                userList:[],
                serachKey:"",
                page:{
                    pageIndex:0,
                    pageSize:10,
                    total:400,
                }
            }
        },
        methods:{
          toDetail(orderId){
            this.$router.push({path:'/orderDetail',query: {orderId:orderId}})
          },
            getOrderList(){
                var that = this;
                var pageIndex = this.page.pageIndex;
                var pageSize = this.page.pageSize;
                axios.post('admin/order/list.do',{pageIndex:pageIndex,pageSize:pageSize}).then((result)=>{
                    console.log(result);
                    that.userList = result.data.list;
                    that.page = result.data.page;
                })
            },
            exportToExcel() {
                var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
                var wb = XLSX.utils.table_to_book(document.querySelector("#user-table"),xlsxParam);
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                        new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
                        "订单信息表.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },
            serach(){
                var that = this;
                if(this.serachKey.length==0){

                }else {
                    var pageIndex = this.page.pageIndex;
                    var pageSize = this.page.pageSize;
                    var seachKey = this.serachKey;
                    axios.post('admin/order/list.do',
                        {pageIndex:pageIndex,pageSize:pageSize,seachKey:seachKey}).then((result)=>{
                        console.log(result);
                        if(result.code){
                            that.userList = result.data.list;
                            that.page = result.data.page;
                        }
                    })
                }
            },
            pageChange(val){
                this.page.pageIndex=val-1;
                this.getOrderList();
            },
            handleSizeChange(val){
                this.page.pageSize=val;
                this.getOrderList();
            },
            deliver(id){
                axios.post("admin/order/deliver.do",{orderId:id}).then((result)=>{
                    if(result.code){
                        this.getOrderList();
                    }
                })
            },
            end(id){
                var that = this;
                axios.post("admin/order/end.do",{orderId:id}).then((result)=>{
                    if(result.code){
                        that.getOrderList();
                    }
                })
            },
          initImgUrl(url){
            if(url.startsWith("http://")){
              return url;
            }
            return "http://img14.360buyimg.com/babel/"+url;
          },
        },
        created() {
            //获取数据
            this.getOrderList();
        }
    }
</script>

<style scoped>
    #user-list,.search,.page{
        padding: 10px 0;
    }
    .search{

    }
    .search-key{
        width: 300px;
        display: inline-block;
    }
    .page{
        text-align: right;
    }
</style>
