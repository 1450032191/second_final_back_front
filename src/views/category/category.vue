<template>
    <div id="category-list">
        <table>
            <tr>
                <td width="50%" style="">
                    <div>
                        <el-tree :data="categoryData"
                                 :props="defaultProps" @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-html="data.categoryName"></span>
                    <span>
                      <el-button
                              type="primary"
                              size="mini"
                              @click="() => append(data)">
                        添加
                      </el-button>
                      <el-button
                              type="danger"
                              size="mini"
                              @click="() => remove(data)">
                        删除
                      </el-button>
                    </span>
                  </span>
                        </el-tree>
                    </div>
                </td>
                <td width="50%">
                    <el-form label-position="right" label-width="80px" :model="formData">
                        <el-form-item label="分类id">
                            <el-input v-model="formData.categoryId" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-input v-model="formData.createTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="分类名称">
                            <el-input v-model="formData.categoryName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="edit()">修改</el-button>
                            <el-button type="primary" @click="append({categoryId:0,categoryName:'根节点'})">增加根节点</el-button>
                        </el-form-item>
                    </el-form>
                </td>
            </tr>
        </table>
        <el-dialog title="新增分类" :visible.sync="dialogFormVisible">
            <el-form :model="newCategory">
                <el-form-item label="父级Id" label-width="150">
                    <el-input v-model="newCategory.categoryId" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="父级名称" label-width="150">
                    <el-input v-model="newCategory.categoryName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="分类名称" label-width="150">
                    <el-input v-model="newCategory.newName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import axios from '@/api'
    export default {
        name: "category",
        data() {
            return {
                categoryData: [{id: 1, name: "11"}],
                defaultProps: {
                    children: 'children',
                    label: 'categoryName'
                },
                formData: {},
                newCategory: {
                    newName:''
                },
                dialogFormVisible: false
            };
        },
        methods: {
            handleNodeClick(data) {
                // console.log(data);
                this.formData = data;
            },
            submitAdd(){
                var that = this;
                var subData = that.newCategory;
                if(subData.newName.length<=0||subData.personId.length<=0){
                    this.$message.error("请补充数据~");
                    return;
                }
                axios({
                    method:"post",
                    url:"admin/category/addCommodityCategory.do",
                    data:subData
                }).then(function(response){
                    let datas = response;
                    if (datas.code == 1) {
                        that.$message.success("新增成功~");
                        //刷新数据
                        that.getCategoryList();
                    } else {
                        that.$message.error(result.errmsg);
                    }
                    that.dialogFormVisible = false;
                })
            },
            //获取物品的类别信息
            getCategoryList() {
                var that=this;
                axios({
                    method:"get",
                    url:"admin/commodity/getFormatCategiryList.do",
                }).then(function(data){
                    if (data.code==1) {
                        that.categoryData = data.data;
                        console.log(that.categoryData);
                    } else {
                        that.$message({
                            showClose: true,
                            message: data.errmsg,
                            type: 'error'
                        });
                    }
                })
            },
            remove(data) {
                console.log(data);
                var that = this;
                this.$confirm('确定删除该分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios({
                        method:"post",
                        url:"admin/category/removeCategory.do",
                        data:data
                    }).then(function(response){
                        // console.log(response.data);
                        let datas = response;
                        if (datas.code==1) {
                            //刷新列表
                            that.getCategoryList();
                            that.$message.success("删除成功")

                        } else {
                            this.$message.error("删除失败")
                        }
                    })
                }).catch(() => {
                    this.$message.error("删除失败")
                });
            },
            append(data) {
                console.log(11);
                var that = this;
                that.newCategory = data;
                that.newCategory.personId = data.categoryId;
                console.log(that.newCategory)
                that.dialogFormVisible = true;
            },
            edit(data) {
                var that = this;
                console.log(that.formData)
                if (that.formData.categoryName.length <= 0) {
                    that.$message.error("请输入名称~");
                }else{
                    axios({
                        method:"post",
                        url:"admin/category/editCategory.do",
                        data:that.formData
                    }).then(function(response){
                        // console.log(response.data);
                        let datas = response;
                        if (datas.code==1) {
                            //刷新列表
                            that.getCategoryList();
                            that.$message.success("修改成功")
                        } else {
                            this.$message.error("修改失败")
                        }
                    })
                }
            }
        },
        created() {
            //获取数据
            this.getCategoryList();
        }
    }
</script>

<style scoped>
    #category-list table {
        width: 100%;
        min-height: 400px;
    }

    #category-list table td > div {
        padding: 5px;
    }

    #category-list table td:nth-child(1) {
        background-color: #fff;
    }

    #category-list table tr {
        /*height: 400px;*/
    }

    #category-list table td {
        /*height: 100%;*/
        vertical-align: top;
    }

    #category-list table td > div {
        /*height: 100%;*/
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .el-tree-node {
        padding: 12px 0;
    }

    .el-tree-node__content {
        height: auto;
    }
</style>
