<template>
  <div id="add-commodity">
    <el-form :model="commodity" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="commodity.commodityName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="commodity.brandId" placeholder="请选择" filterable>
          <el-option
              v-for="item in brands"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId">
            <span style="float: left">{{ item.brandName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
            v-model="commodity.categoryId"
            :options="categorys"
            :props="{ expandTrigger: 'hover',checkStrictly: true}"
            :show-all-levels="false" filterable></el-cascader>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
            :file-list="imgFileList"
            class="upload-demo"
            action="util/upOSSImg.do"
            ref="upload_img"
            :multiple="true"
            accept="image/jpeg,image/jpg,image/png"
            :on-preview="handlePreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :http-request="uploadSectionFile"
            list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <!--                            :file-list="commodity.imgs"-->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

      </el-form-item>

      <el-form-item label="商品属性">
        <el-table
            :span-method="arraySpanMethod"
            :data="commodity.details"
            border
            style="width: 100%">
          <el-table-column
              prop="fieldName"
              label="属性名"
              align="center">
            <template scope="scope">
              <div>
                {{ scope.row.fieldName }}
                <br>
                <el-button size="mini" round @click="addFieldValue(scope)">添加值</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="fieldValue"
              label="属性值"
              align="center">
            <template scope="scope">
              <div>
                {{ scope.row.fieldValue }}
                <el-avatar v-show="fieldList[scope.row.fieldName].imgMap[scope.row.fieldValue]"
                           @click.native="uploadFieldValueImgClick(scope.row.fieldName,scope.row.fieldValue)"
                           shape="square" size="small"
                           :src="fieldList[scope.row.fieldName].imgMap[scope.row.fieldValue]"></el-avatar>
                <el-button size="mini" type="danger" round @click="delFieldValue(scope)">删除</el-button>

                <el-button size="mini"
                           v-show="!fieldList[scope.row.fieldName].imgMap[scope.row.fieldValue]"
                           @click="uploadFieldValueImgClick(scope.row.fieldName,scope.row.fieldValue)"
                           type="info" round>上传图片
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px 0;text-align: right">
          <el-button @click="generSkuList">生成SKU列表</el-button>
          <el-button @click="addDetail">新增属性</el-button>
        </div>
        <input type="file" ref="uploadFieldValueImg"
               accept="image/*"
               v-show="false" @change="uploadFieldValueImg"/>
      </el-form-item>

      <el-form-item label="SKU列表">
        <el-table
            :data="skuList"
            border
            :span-method="skuArraySpanMethod"
            style="width: 100%">
          <el-table-column
              v-for="(item,index) in fieldNameList"
              :key="index"
              :label="item"
              align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row[item] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="stock"
              label="库存"
              align="center">
            <template scope="scope">
              <div>
                <el-input-number v-model="scope.row.stock"
                                 size="mini"
                                 :min="0" :max="9999" label="商品库存"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="stock"
              label="原价"
              align="center">
            <template scope="scope">
              <div>
                <el-input-number v-model="scope.row.op"
                                 size="mini"
                                 :precision="2"
                                 :min="0" label="商品原价"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="stock"
              label="售价"
              align="center">
            <template scope="scope">
              <div>
                <el-input-number v-model="scope.row.price"
                                 size="mini"
                                 :precision="2"
                                 :min="0" label="商品售价"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="其他信息">
        <el-table
            :data="otherFieldInfo"
            border
            style="width: 100%">
          <el-table-column
              prop="key"
              label="属性名"
              align="center">
            <template scope="scope">
              <div>
                <el-input size="mini"
                          v-model="scope.row.key" placeholder="请输入内容"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="key"
              label="属性值"
              align="center">
            <template scope="scope">
              <div>
                <el-input size="mini"
                          v-model="scope.row.value" placeholder="请输入内容"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="70"
              align="center">
            <template scope="scope">
              <div>
                <el-button type="danger"
                           @click="delOtherField(scope)"
                           icon="el-icon-delete" circle
                           size="mini"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div style="margin: 10px 0;text-align: right">
        <el-button @click="addOtherField">新增</el-button>
      </div>
      <el-form-item>
        <editor v-model="commodity.commodityDesc"
                upload-url="util/upImg.do" fileName="file"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="oneSubmit">{{isAdd ? '立即创建' : '立即修改'}}</el-button>
        <el-button @click="toList()">取消</el-button>
      </el-form-item>
    </el-form>


    <el-dialog
        title="添加属性值"
        :visible.sync="isShowAddFieldDoalog"
        width="30%">

      <el-input v-model="newField.name" placeholder="请输入属性名"></el-input>
      <el-input v-model="newField.value" placeholder="请输入属性值"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddFieldDoalog = false">取 消</el-button>
        <el-button type="primary" @click="addNewFieldNameValue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import editor from '@/components/editor.vue'


export default {
  name: "add",
  components: {editor},
  data() {
    return {
      otherFieldInfo: [
        // {
        //   "key": '',
        //   "value": ''
        // }
      ],
      imgFileList: [
        // {
        //   url: 'http://localhost:8081/final/upload/sys_images/a0efd7b99f835407.jpg'
        // }
      ],
      isShowAddFieldDoalog: false,
      newField: {
        name: '',
        value: ''
      },
      // fieldNameList: ['颜色', '尺码'],
      fieldNameList: [],
      // fieldList: {
      //   '颜色': {
      //     fieldName: '颜色',
      //     valueMap: {
      //       '绿色': {},
      //       '红色': {},
      //       '白色': {}
      //     },
      //     valueList: ['绿色', '红色', '白色'],
      //     imgMap: {
      //       '绿色': 'http://zzn-android.oss-cn-hangzhou.aliyuncs.com/final/2021011922551548209617.png'
      //     }
      //   },
      //   '尺码': {
      //     fieldName: '尺码',
      //     valueMap: {
      //       'L': {},
      //       'XL': {},
      //       'XXL': {}
      //     },
      //     valueList: ['L', 'XL', 'XXL'],
      //     imgMap: {}
      //   }
      // },
      fieldList: {},
      skuList: [
        // {
        //   '123123': '123',
        //   stock: 0,
        //   price: 0.00,
        //   op: 0.00
        // }
      ],
      commodity: {
        commodityName: "",
        jdMainSku: "",
        brandId: "",
        categoryId: "",
        imgs: [],
        details: [
          // {
          //   fieldName: '颜色',
          //   fieldValue: '绿色',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // },
          // {
          //   fieldName: '颜色',
          //   fieldValue: '红色',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // },
          // {
          //   fieldName: '颜色',
          //   fieldValue: '白色',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // },
          // {
          //   fieldName: '尺码',
          //   fieldValue: 'L',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // },
          // {
          //   fieldName: '尺码',
          //   fieldValue: 'XL',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // },
          // {
          //   fieldName: '尺码',
          //   fieldValue: 'XXL',
          //   fieldId: 123,
          //   fieldValueId: 123,
          // }
        ],
        commodityDesc: '',
        skuPrice: '',
        skuOp: '',
        skuStock: ''
      },
      dialogVisible: false,
      dialogImageUrl: '',
      brands: [],
      fileList: [],
      categorys: [],
      fieldKeyList: [{
        key: "ceadas",
        values: [
          "1231", "3213"
        ]
      },
        {
          key: "ceadas",
          values: [
            "1231", "3213"
          ]
        }
      ],
      activiFieldName: '',
      activiFieldValue: '',
      isAdd: true
    }
  },
  created() {
    this.init();
    this.getBrands();
    this.getFormatCategiryList();
  },
  methods: {
    toList(){
      this.$router.push({path:'/commodity'})
    },
    init(){
      var that = this
      var spu = this.$route.query.spu
      if(spu){
        axios.get('getCommodityDetail.do?spu='+spu).then(res => {
          if(res.code == 1){
            var data = res.data
            that.otherFieldInfo = data.otherFieldInfo
            that.imgFileList = data.imgFileList
            that.fieldNameList = data.fieldNameList
            that.fieldList = data.fieldList
            that.skuList = data.skuList
            that.commodity.categoryId = data.categoryId
            that.commodity.brandId = parseInt(data.brandId)
            that.commodity.details = data.commodityDetail
            that.commodity.commodityName = data.commodityName
            that.commodity.commodityDesc = data.commodityDesc
            that.isAdd = false
          }
        })
      }
    },
    getBrands() {
      var that = this;
      axios.get("admin/commodity/getBrands.do").then(function (result) {
        if (result.code) {
          that.brands = result.data;
        }
      });
    },
    getFormatCategiryList() {
      var that = this;
      axios.get("admin/commodity/getFormatCategiryList.do").then(function (result) {
        if (result.code) {
          that.categorys = result.data;
        }
      });
    },
    oneSubmit() {
      // 开始准备数据
      var {skuList, fieldList, fileList, imgFileList, commodity} = this

      // commodity.commodityName = "测试一下"
      // commodity.brandId = 831
      // commodity.categoryId = 650
      // commodity.commodityDesc = '<p>123213</p>'

      var commodityDetail = {}
      console.log(fileList)
      for (let i = 0; i < skuList.length; i++) {
        if (skuList[i].price < 0.01) {
          this.$message.error('售价最低不能低于0.1元！')
          return
        }
      }
      var imgArr = [];
      if (fileList.length != 0) {
        for (let i = 0; i < fileList.length; i++) {
          imgArr.push(fileList[i].url)
        }
      } else if (imgFileList.length != 0) {
        for (let i = 0; i < imgFileList.length; i++) {
          imgArr.push(imgFileList[i].url)
        }
      } else {
        this.$message.error('请上传商品图片!')
        return
      }
      commodityDetail.imgArr = JSON.stringify(imgArr)

      if (commodity.commodityName && commodity.commodityName.length > 0) {
        commodityDetail.commodityName = commodity.commodityName
      } else {
        this.$message.error('请输入商品标题!')
        return
      }

      if (commodity.brandId) {
        commodityDetail.brandId = commodity.brandId
      } else {
        this.$message.error('请输入商品品牌!')
        return
      }

      if (commodity.categoryId) {
        if (commodity.categoryId instanceof Array) {
          commodityDetail.categoryId = commodity.categoryId[commodity.categoryId.length - 1]
        } else if (commodity.categoryId instanceof Number
            || commodity.categoryId instanceof String) {
          commodityDetail.categoryId = commodity.categoryId
        } else {
          this.$message.error('请输入商品分类!')
          return
        }
      } else {
      }

      if (commodity.commodityDesc && commodity.commodityDesc.length > 0) {
        commodityDetail.commodityDesc = commodity.commodityDesc
      } else {
        this.$message.error('请输入商品介绍!')
        return
      }


      // 处理
      var otherField = {}
      var { otherFieldInfo } = this
      for (let i = 0; i < otherFieldInfo.length; i++) {
        if(otherFieldInfo[i].key&&otherFieldInfo[i].key.length>0){
          if(otherFieldInfo[i].value&&otherFieldInfo[i].value.length>0){
            this.$set(otherField,otherFieldInfo[i].key,otherFieldInfo[i].value)
            continue
          }
        }
        this.$message.error('请输入内容！')
      }

      commodityDetail.skuList = JSON.stringify(skuList)
      commodityDetail.fieldList = JSON.stringify(fieldList)
      commodityDetail.commodityDetailInfo = JSON.stringify(otherField)

      console.log(JSON.stringify(commodityDetail))
      axios.post('/admin/commodity/addCommodity.do', commodityDetail).then(res => {
        console.log(res)
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      var uid = file.uid;
      for (let i = 0; i < this.commodity.imgs.length; i++) {
        var file = this.commodity.imgs[i];
        if (uid == file.key) {
          this.commodity.imgs.splice(i, 1);
          break;
        }
      }
      this.$message({
        type: 'info',
        message: '已删除图片',
        duration: 1000
      });
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    uploadSectionFile(params) {
      // 自定义上传方法
      var that = this,
          file = params.file,  //获取上传的文件
          fileType = file.type,   //获取文件类型
          isImage = fileType.indexOf('image') != -1,  // 判断是否是图片类型
          file_url = that.$refs.upload_img.uploadFiles[0].url;
      var isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message({
          type: 'info',
          message: '上传图片的大小不能超过 2MB!',
          duration: 1000
        });
        that.$refs.upload_img.uploadFiles = [];  //不符合就清空已选择的图片
        return;
      }
      if (!isImage) {  // 文件格式
        this.$message({
          type: 'info',
          message: '请选择图片文件',
          duration: 1000
        });
        that.$refs.upload_img.uploadFiles = [];   //不符合就清空已选择的图片
        return;
      }
      if (isImage) {
        var img = new Image();
        img.src = file_url;
        img.onload = function () {
          var formData = new FormData();
          formData.append("file", file);
          axios.post("util/upOSSImg.do", formData, {headers: {'Content-Type': 'multipart/form-data'}})
              .then(function (res) {
                if (res.code) {
                  var list = that.fileList
                  for (var item in list) {
                    console.log(list[item].uid, file.uid)
                    if (list[item].uid === file.uid) {
                      list[item].url = res.data.url
                    }
                  }
                } else {
                  that.$refs.upload_img.uploadFiles = [];
                  that.$message({
                    type: 'error',
                    message: '图片上传异常，原因：' + res.errmsg,
                    duration: 1000
                  });
                }
              })
        }
      }
    },
    addDetail() {
      this.isShowAddFieldDoalog = true
    },
    removeDetail(detail) {
      var index = this.commodity.details.indexOf(item)
      if (index !== -1) {
        this.commodity.details.splice(index, 1)
      }
    },
    submitDesc() {

    },
    addField() {
      var that = this;
      var item = true;
      for (let i = 0; i < that.fieldKeyList.length; i++) {
        if (that.fieldKeyList[i].key.length == 0
            || that.fieldKeyList[i].values.length == 0) {
          that.$message.error("请填充数据~");
          item = false;
          return;
        }
      }
      if (item) {
        that.fieldKeyList.push({
          key: "",
          values: []
        })
        this.generateFieldList();
      }
    },
    delItemValues(index, vIndex) {
      this.fieldKeyList[index].values.splice(vIndex, 1);
      this.generateFieldList();
    },
    addItemValues(index) {
      for (let i = 0; i < this.fieldKeyList[index].values.length; i++) {
        if (this.fieldKeyList[index].values[i].length == 0) {
          this.$message.error("请完善属性值信息");
          return;
        }
      }
      this.fieldKeyList[index].values.push("");
      this.generateFieldList();
    },
    delField(index) {
      this.fieldKeyList.splice(index, 1);
      this.generateFieldList();
    },
    generateFieldList() {
      var fieldKeyList = this.fieldKeyList;
      var data = {
        skuPrice: "",
        skuOp: "",
        skuStock: ""
      };
      var list = [];
      for (let i = 0; i < fieldKeyList.length; i++) {
        var value = fieldKeyList[i].values;
        if (value.length == 0) {
          data[fieldKeyList[i].key] = "";
          list.push(data);
          console.log(22);
        } else {
          for (let j = 0; j < value.length; j++) {
            data[fieldKeyList[i].key] = value[j];
            list.push(data);
          }
        }
      }
      console.log(list);
      this.fieldList = list;
    },
    addCommodity() {
      var data = this.commodity;
      data.categoryId = data.categoryId[data.categoryId.length - 1];
      data.commodityDetailInfo = JSON.stringify(data.details);
      data.commodityMainImg = data.imgs[0].value;
      data.imgs = JSON.stringify(data.imgs);
      // axios.post("admin/commodity/addCommodity.do",data,function (result) {
      //     // if(result.code){
      //     //     this.$routes.push('/commodity');
      //     // }else {
      //     //     this.$message.error(result.errmsg);
      //     // }
      //     this.$message.error("增加成功~");
      //     this.$routes.push('/commodity');
      // })
      this.$message.error("增加成功~");
      // this.$route.push('/commodity');
      this.$router.push({path: '/commodity'})
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        var showRow = this.getShowFieldRow(rowIndex);
        if (showRow != 0) {
          return {
            rowspan: showRow,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    getShowFieldRow(rowIndex) {
      var {commodity} = this
      if (commodity.details.length <= rowIndex) {
        return 0;
      }
      if (rowIndex === 0 || commodity.details[rowIndex].fieldName != commodity.details[rowIndex - 1].fieldName) {
        var fieldName = commodity.details[rowIndex].fieldName;
        var count = 0;
        for (let i = rowIndex; i < commodity.details.length; i++) {
          if (fieldName == commodity.details[i].fieldName) {
            count++;
          } else {
            return count;
          }
        }
        return count;
      } else {
        return 0;
      }
    },
    addFieldValue(row) {
      var {commodity, fieldList} = this
      this.$prompt('请输入属性值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        commodity.details.splice(row.$index, 0, {
          fieldName: row.row.fieldName,
          fieldValue: value,
        });

        var obj = fieldList[row.row.fieldName]
        if (obj == undefined) {
          obj = {
            fieldName: row.row.fieldName,
            valueList: [],
            valueMap: {},
            imgMap: {}
          }
        }
        obj.valueMap[value] = {}
        obj.valueList.push(value)
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    delFieldValue(row) {
      var {commodity, fieldList, fieldNameList} = this
      commodity.details.splice(row.$index, 1)
      delete fieldList[row.row.fieldName].valueMap[row.row.fieldValue]
      if (JSON.stringify(fieldList[row.row.fieldName].valueMap) == "{}") {
        delete fieldList[row.row.fieldName]
        for (let i = 0; i < fieldNameList.length; i++) {
          if (fieldNameList[i] == row.row.fieldName) {
            fieldNameList.splice(i, 1);
            continue
          }
        }
      }
    },
    addNewFieldNameValue() {
      var {newField, fieldList, commodity} = this
      var index = 0;
      for (let i = 0; i < commodity.details.length; i++) {
        if (commodity.details[i].fieldName == newField.name) {
          if (commodity.details[i].fieldValue == newField.value) {
            this.$message.info('已经存在！')
            return
          }
          if (i != commodity.details.length - 1) {
            if (commodity.details[i].fieldName != commodity.details[i + 1].fieldName) {
              continue
            }
          }
          index = i
        }
      }
      if (index == 0) {
        index = commodity.details.length
      }
      commodity.details.splice(index, 0, {
        fieldName: newField.name,
        fieldValue: newField.value,
      })
      var obj = fieldList[newField.name]
      if (obj == undefined) {
        obj = {
          fieldName: newField.name,
          valueMap: {},
          valueList: [],
          imgMap: {}
        }
      }
      obj.valueMap[newField.value] = {}
      obj.valueList.push(newField.value)
      fieldList[newField.name] = obj
      this.fieldNameList.push(newField.name)
      this.$message.success('添加成功了！')
      newField = {
        name: '',
        value: ''
      }
      this.isShowAddFieldDoalog = false
    },
    generSkuList() {
      this.skuList = []
      this.generSkuListItem(0)
      console.log(this.skuList)
    },
    generSkuListItem(index, obj) {
      var {fieldList} = this
      if (index == 0) {
        obj = {
          fieldNameMap: {},
        }
      }
      if (this.getArrLength(fieldList) == index) {
        // 添加到列表中
        var item = JSON.parse(JSON.stringify(obj));
        item.stock = 10
        item.price = 10.00
        item.op = 10.00
        this.skuList.push(item)
      } else {
        var field = this.getArrIndeKey(fieldList, index)
        if (field != undefined) {
          for (var valueItem in field.valueMap) {
            obj.fieldNameMap[field.fieldName] = valueItem
            obj[field.fieldName] = valueItem
            this.generSkuListItem(index + 1, obj)
          }
        }
      }
    },
    getArrIndeKey(arr, index) {
      var {fieldList, fieldNameList} = this
      if (index < fieldNameList.length) {
        return fieldList[fieldNameList[index]]
      }
    },
    getArrLength(arr) {
      var len = 0
      for (var item in arr) {
        len++
      }
      return len
    },
    skuArraySpanMethod({rowIndex, columnIndex}) {
      var {skuList} = this
      if (columnIndex < this.fieldNameList.length) {
        var fieldName = this.fieldNameList[columnIndex]
        if (rowIndex == 0 || skuList[rowIndex][fieldName] != skuList[rowIndex - 1][fieldName]) {
          var len = 0
          var fieldValue = skuList[rowIndex][fieldName]
          for (let i = rowIndex; i < skuList.length; i++) {
            console.log(skuList[i][fieldName], fieldName)
            if (skuList[i][fieldName] == fieldValue) {
              len++
            } else {
              break
            }
          }
          console.log(len)
          return [len, 1]
        } else {
          return [0, 0]
        }
      }
    },
    uploadFieldValueImgClick(fieldName, fieldValue) {
      console.log(123123)
      this.activiFieldName = fieldName
      this.activiFieldValue = fieldValue
      console.log(this.$refs.uploadFieldValueImg)
      this.$refs.uploadFieldValueImg.dispatchEvent(new MouseEvent('click'))
    },
    uploadFieldValueImg() {
      var that = this
      var formData = new FormData();
      formData.append("file", this.$refs.uploadFieldValueImg.files[0]);
      axios.post("util/upOSSImg.do", formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(function (res) {
            if (res.code) {
              that.$set(
                  that.fieldList[that.activiFieldName].imgMap,
                  that.activiFieldValue,
                  res.data.url)
              that.activiFieldName = ''
              that.activiFieldValue = ''
            } else {
              that.$refs.upload_img.uploadFiles = [];
              that.$message({
                type: 'error',
                message: '图片上传异常，原因：' + res.errmsg,
                duration: 1000
              });
            }
          })
    },
    delOtherField(scope) {
      this.otherFieldInfo.splice(scope.$index, 1)
    },
    addOtherField() {
      this.otherFieldInfo.push({
        "key": '',
        "value": ''
      })
    }
  },
  watch: {
    'fieldKeyList': function () {
      this.generateFieldList();
    }
  }
}
</script>

<style scoped>
#add-commodity > div {
  padding: 10px 0;
}

.field-con {
  width: 100%;
}

.field-con td {
  padding: 10px;
}

.field-con > tr td:nth-child(1) {
  width: 15%;
  text-align: right;
  vertical-align: top;
  min-width: 92px;
}

.field-con > tr td:nth-child(2) {
  width: 85%;
  vertical-align: top;
}

.field-key-table {
  padding: 0 5px;
  border: solid 1px #DCDFE6;
  width: 100%;
}

.field-key-table > div > tr td:nth-child(1) {
  width: 10%;
  text-align: right;
  vertical-align: middle;
  min-width: 100px;
}

.field-key-table > div > tr td:nth-child(2) {
  width: 80%;
  vertical-align: middle;
}

.field-key-table > div {
  display: table;
  width: 100%;
}

.table-bg {
  background-color: #FAFAFA;
}

table {
  border-collapse: collapse;
  padding: 0;
}

.txt {
  padding: 5px 0px;
  color: #909399;
  display: inline-block;
  font-size: 12px;
}

.el-input, .el-button.is-circle {
  margin: 5px 0;
}
</style>
