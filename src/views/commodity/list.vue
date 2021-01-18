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
                :data="commodityList"
                border
                style="width: 100%" id="user-table">
            <el-table-column
                    prop="date"
                    label="#"
                    type="index"
                    width="50" align="center">
            </el-table-column>
            <el-table-column
                    label="商品主图"
                    width="180" align="center">
                <template slot-scope="scope">
                    <el-avatar shape="square" :size="100" fit="fill" :src="'http://img11.360buyimg.com/mobilecms/s140x140_'+scope.row.commodityMainImg"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column
                    prop="commodityName"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    prop="brandName"
                    label="品牌名称" width="120">
            </el-table-column>
            <el-table-column
                    prop="sales"
                    label="销量" width="80">
            </el-table-column>
            <el-table-column
                    prop="status"
                    :filters="[{ text: '启用', value: '1' }, { text: '禁用', value: '0' }]"
                    :filter-method="filterStatus"
                    label="状态"
                    width="80"
                    align="center">
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.status === '1' ? 'success' : 'error'"
                            disable-transitions>{{scope.row.status === '1' ? '启用' : '禁用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="setStatus(scope.row.commodityId)" :type="scope.row.status == 0 ?'warning':'danger'">{{scope.row.status == 0 ?'启用':'禁用'}}</el-button>
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
                commodityList:[],
                serachKey:"",
                page:{
                    pageIndex:0,
                    pageSize:10,
                    total:400,
                }
            }
        },
        methods:{
            filterStatus(value, row) {
                return row.status === value;
            },
            getUserList(){
                var that = this;
                var pageIndex = this.page.pageIndex;
                var pageSize = this.page.pageSize;
                axios.post('admin/commodity/list.do',{pageIndex:pageIndex,pageSize:pageSize}).then((result)=>{
                    console.log(result);
                    that.commodityList = result.data.list;
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
                        "商品基本信息表.xlsx"
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
                    axios.post('admin/commodity/list.do',
                        {pageIndex:pageIndex,pageSize:pageSize,seachKey:seachKey}).then((result)=>{
                        console.log(result);
                        if(result.code){
                            that.commodityList = result.data.list;
                            that.page = result.data.page;
                        }
                    })
                }
            },
            pageChange(val){
                this.page.pageIndex=val-1;
                this.getUserList();
            },
            handleSizeChange(val){
                this.page.pageSize=val;
                this.getUserList();
            },
            setStatus(id){
                axios.post("admin/commodity/setCommodityStatus.do",{id:id}).then((result)=>{
                    if(result.code){
                        this.getUserList();
                    }
                })
            }
        },
        created() {
            //获取数据
            this.getUserList();
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