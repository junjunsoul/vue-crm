<style lang='less'>
	@import "./record-manage.less";
</style>
<template>
	<div class="record">
		<Button type="primary" icon="plus-round" @click="add">添加客户信息</Button>
		<div class="record-query-card">
		    <Card shadow>
		      <p>搜索条件：</p>
		      <Input v-model="maintb.filter.C_name" placeholder="输入客户姓名..." style="width: 150px"></Input>
		      
		      <Button type="primary" icon="ios-search" @click="sever_search">查询</Button>
		    </Card>
	    </div>
		<div class="page">
			<Row>
				<Col span="20" order="1">
					<Page :total="maintb.total" show-elevator @on-change="page_chang"></Page>
				</Col>
				<Col span="4" order="2" style="text-align: right;">
				    <Tooltip content="导出表格" placement="left-start" >
					 	<Button type="text" size="small" @click="exportData('客户列表')">
					 		<Icon type="ios-download" style="font-size: 23px"></Icon>
					 	</Button>
				    </Tooltip>
				</Col>
			</Row>
		</div>
		<Table border height='500' :loading="tb_loading" :columns="maintb.list_columns" :data="filter_tb_data" ref="tableCsv"></Table>
		
	    <Modal
	        v-model="cu_modali"
	        width="850"
	        title="客户信息"
	        :loading="loading"
	        @on-ok="handleSubmit"
	        @on-cancel="cancel">
	        <Form :model="form_item" ref="form_item" :rules="formRules" :label-width="90" >
	        	<Row>
	        		<Col span="8">	
			        	<FormItem label="客户编码：" prop="C_code">
				            <Input v-model="form_item.C_code" placeholder="请输入编码..."></Input>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="客户类型：">
				            <Select v-model="form_item.C_type">
				                <Option value="学生">学生</Option>
				                <Option value="社会人士">社会人士</Option>
			            	</Select>
			        	</FormItem>
			        </Col>
	        		<Col span="8">	
			        	<FormItem label="姓名：" prop="C_name">
				            <Input v-model="form_item.C_name" placeholder="请输入姓名..."></Input>
				        </FormItem>
			    	</Col>			        
		        </Row>
	        	<Row>
			    	<Col span="8">
			        	<FormItem label="性别：">
				            <Select v-model="form_item.C_sex">
				                <Option value="男">男</Option>
				                <Option value="女">女</Option>
			            	</Select>
				        </FormItem>
			        </Col>			    	
			        <Col span="8">
			        	<FormItem label="年龄：">
			        		<Input v-model="form_item.C_age" placeholder="请输入年龄..."></Input>
				        </FormItem>
			        </Col>			    	
			        <Col span="8">
			        	<FormItem label="所在学校：">
			        		<Input v-model="form_item.C_school" placeholder="请输入学校名称..."></Input>
				        </FormItem>
			        </Col>

		        </Row>
		        <Row>
		        	<Col span="16">
			        	<FormItem label="省/市/区：">
			        		<Row>
			        			<Col span="24">
	                        		<al-cascader v-model="C_p_c" data-type='name' level='2' auto/>
	                        	</Col>
	                        </Row>			        
                    	</FormItem>
		        	</Col>
	        		<Col span="8">	
			        	<FormItem label="近视时间：">
			        		 <DatePicker type="date" v-model="form_item.C_myopia_date" style="width:182px;" placeholder="选择日期"></DatePicker>
				        </FormItem>
			    	</Col>		        	
		        </Row>
	        	<Row>
			    	<Col span="8">
			        	<FormItem label="紧急联系人：">
			        		<Input v-model="form_item.C_emergency_contact" placeholder="请输入联系人..."></Input>
			        	</FormItem>
			        </Col>	        		
	        		<Col span="8">	
			        	<FormItem label="联系电话：">
			        		<Input v-model="form_item.C_contact_phone" placeholder="请输入电话号码..."></Input>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="联系人类别：">
				            <Select v-model="form_item.C_contact_type">
				                <Option value="0">本人</Option>
				                <Option value="1">朋友</Option>
				                <Option value="2">亲人</Option>
			            	</Select>
			        	</FormItem>
			        </Col>
		        </Row>		        
		        <Row>
		        	<Col span="24">
			        	<FormItem label="详细地址：">	
			        		<Input v-model="form_item.C_address" placeholder="请输入详细地址..."></Input>
                    	</FormItem>
		        	</Col>
		        </Row>
		        <Row>
		        	<Col span="24">
			        	<FormItem label="备注：">	
			        		<Input v-model="form_item.C_remark" type="textarea" :rows="4" placeholder="请输入备注..."></Input>
                    	</FormItem>
		        	</Col>
		        </Row>
	        </Form>
	    </Modal>
	    <Modal v-model="delete_modal" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除确认</span>
	        </p>
	        <div style="text-align:center">
	            <p>此数据删除后，不可恢复。</p>
	            <p>是否继续删除？</p>
	        </div>
	        <div slot="footer">
	            <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
	        </div>
	    </Modal>
	</div>
</template>
<script>
	//客户档案管理
	import util from '@/libs/util'
	let url={
		operate: '/bar',
		delete: '/bar',
		search: '/bar'
	}
    let default_form = {
		state: 'add',    	
		C_code:'' , 
		C_type: '' , 
		C_name: '' , 
		C_sex: '' ,
		C_age: '',
		C_school: '',
		C_province: '',
		C_city: '',
		C_area: '',
		C_address: '',
		C_myopia_date: '',
		C_emergency_contact: '',
		C_contact_phone: '',
		C_contact_type: '',
		C_default_contact: '',
		C_remark: '',
	}
	
	export default{
		name:'recordManage',
		data(){
			return {
				delete_modal: false,
				modal_loading: false,
				loading: true ,	
				tb_loading: false ,		
				cu_modali: false ,		
				C_p_c:[],			
				maintb: {
					cur_sel_index:null,
					filter: {
						C_name:''
					},
					total: 100,					
					initTable: [],
					list_columns: [
						{ width: 130, key: 'C_code', title: '客戶编号', sortable: true },
						{ width: 130, key: 'C_name', title: '客户姓名', sortable: true },					
						{ width: 130, key: 'C_type', title: '客戶类型', sortable: true },
						{ width: 130, key: 'C_sex', title: '性别', sortable: true },
						{ width: 130, key: 'C_province', title: '省份', },
						{ width: 130, key: 'C_city', title: '城市', },
						{ width: 130, key: 'C_area', title: '区域', },
						{ width: 130, key: 'C_address', title: '详细地址', },
						{ width: 130, key: 'C_myopia_date', title: '近视时间', sortable: true },
						{ width: 130, key: 'C_emergency_contact', title: '紧急联系人' },
						{ width: 130, key: 'C_contact_phone', title: '联系人电话' },
						{ width: 130, key: 'C_contact_type', title: '联系人类别', sortable: true },
						{ width: 130, key: 'C_default_contact', title: '默认联系人' },
						{ width: 130, key: 'C_remark', title: '备注' },
						{ width: 130, key: 'C_createdate', title: '创建时间', sortable: true },
						{ width: 130, key: 'C_updatedate', title: '更新时间', sortable: true },
						{ width: 130, key: 'C_state', title: '数据状态', sortable: true },
						{ width: 150, key: 'Action', title: ' ', fixed: 'right', 
							render: (h, params) => {
								return h('div', [
	                                h('Button', {
	                                    props: {
	                                        type: 'text',
	                                        size: 'small',
	                                        icon: 'ios-search-strong'
	                                    },
	                                    on: {
	                                    	click: () => {
	                                    		this.show(params.index)
	                                    	}
	                                    }
	                                }, ''),
	                                h('Button', {
	                                    props: {
	                                        type: 'text',
	                                        size: 'small',
	                                		icon: 'edit'
	                                    },
	                                    on: {
	                                    	click: () => {
	                                    		this.edit(params.index)
	                                    	}
	                                    }
	                                }, ''),
	                                h('Button', {
	                                	props: {
	                                		type: 'text',
	                                		icon: 'trash-a'
	                                	},
	                                	on: {
	                                		click: () => {
	                                			this.remove(params.index)
	                                		}
	                                	}
	                                },'')
	                            ]);
							}
						}
					],
					list_data: [
						{
							C_id :'001' , 
							C_code:'x00001' , 
							C_type: '学生' , 
							C_name: '陈晓丽' , 
							C_sex: '女' ,
							C_age: '14',
							C_school: '北京小学',
							C_province: '安徽省',
							C_city: '合肥市',
							C_area: '蜀山区',
							C_address: '某某公寓',
							C_myopia_date: '2017-12-30',
							C_emergency_contact: '陈旭华',
							C_contact_phone: '13277781234',
							C_contact_type: '亲人',
							C_default_contact: '紧急联系人',
							C_remark: '不是本地人不经常出现在本市区',
						}
					],					
				},
				form_item:{},
	            formRules: {
	                C_name: [
	                    { required: true, message: '请填客户名称', trigger: 'blur' }
	                ],
	                C_code: [
	                    { required: true, message: '请填客户编码', trigger: 'blur' }
	                ]
	            },
			}
		},
		methods: {
			init(){
				this.getData()
			},

			cancel(){
				this.cu_modali=false
			},

            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: this.show_handle(this.maintb.list_data[index])
                })
            },

            add () {
            	this.form_item= util.deepCopy(default_form)
            	this.C_p_c=[]
            	this.cu_modali = true
            	
            },
            remove (index) {
            	this.delete_modal = true  
            	this.maintb.cur_sel_index = index
            },

            exportData (title){
                this.$refs.tableCsv.exportCsv({
                    filename: title,
                    original: false
                });
            },

            edit (index) {
            	this.form_item=Object.assign(this.form_item,this.maintb.list_data[index])
            	this.C_p_c=[this.form_item.C_province,this.form_item.C_city,this.form_item.C_area]
            	this.form_item.state='edit'
            	
            	this.cu_modali = true
            },
            del () {
                this.modal_loading = true
                let id=this.maintb.list_data[this.maintb.cur_sel_index].C_id
	        	util.ajax.post(url.delete,{C_id:id}).then((res) => {
	        		if(res.code){
		                    this.modal_loading = false
		                    this.delete_modal = false
		                    this.$Message.success('删除成功！')
		                    this.maintb.list_data.splice(this.maintb.cur_sel_index, 1)     			
	        		}else{
	        			this.$Message.error('删除失败！')
	        		}
	        	})
            },

			show_handle(data){
				var re_str=''
				this.maintb.list_columns.map(item => {
					if(item.title&&data[item.key]){
						re_str += `
						<div class="show_info">
							<span class="title">${item.title}:</span>
							<span class="text">${data[item.key]}</span>
						</div>
						`
					}
				})
				return re_str
			},

			sever_search(){
				this.getData(1,this.maintb.filter)
			},

			page_chang(cur){
				this.getData(cur)
			},

			getData(page=1,filter={}){
				this.tb_loading=true
				this.maintb.list_data=[]
	        	util.ajax.post(url.search,Object.assign({page:page},filter)).then((res) => {
	        		if(res.code){
	        			//this.maintb.total=res.total
						//this.maintb.list_data=data
	        		}
	        		this.tb_loading=false
	        	})
			},

	        handleSubmit () {
	            this.$refs['form_item'].validate((valid) => {
	                if (valid) {
			        	util.ajax.post(url.operate,this.form_item).then((res) => {
			        		if(res.code){
			        			this.$Message.success('操作成功！');
			        			this.getData()
			        			this.cu_modali=false
			        		}else{
				                this.$Notice.error({
				                    title: '操作失败',
				                    desc: res.msg
				                })
			        		}
			        	})
	                }else{
	                	setTimeout(() => {
	                		this.loading=false
	                		setTimeout(() => {
	                			this.loading=true
	                		},10)
	                	},1000)
	                }
	            });
	            return false
	        }
		},
		computed: {
			filter_tb_data(){
				let r_d=util.search(this.maintb.list_data,this.maintb.filter)
				return r_d
			}
		},
		mounted () {
			//this.init()
		}
	}
</script>