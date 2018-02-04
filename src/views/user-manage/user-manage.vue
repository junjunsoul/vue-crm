<style lang='less'>
	@import "./user-manage.less";
</style>
<template>
	<div class="user">
		<Button type="primary" icon="plus-round" @click="add">添加用户信息</Button>
		<div class="user-query-card">
		    <Card shadow>
		      <p>搜索条件：</p>
		      <Input v-model="maintb.filter.a_login" placeholder="输入账号..." style="width: 150px"></Input>
		      
		      <Button type="primary" icon="ios-search" @click="sever_search">查询</Button>
		    </Card>
	    </div>
		<div class="page">
			<Row>
				<Col span="24">
					<Page :total="maintb.total" show-elevator @on-change="page_chang" @on-page-size-change="page_size_change" :page-size="maintb.page_size"  :current="maintb.current":page-size-opts="[20,40,50]" show-total show-sizer></Page>
				</Col>
			</Row>
		</div>
		<Table border height='500' :loading="tb_loading" :columns="maintb.list_columns" :data="filter_tb_data" ref="tableCsv"></Table>
	    <Modal
	        v-model="cu_modali"
	        width="850"
	        title="用户信息"
	        :mask-closable="false"
	        :loading="loading"
	        @on-ok="handleSubmit"
	        @on-cancel="cancel">
	        <Form :model="form_item" ref="form_item" :rules="formRules" :label-width="95" >
	        	<Row>
	        		<Col span="8">	
			        	<FormItem label="用户账号：" prop="a_login">
				            <Input v-model="form_item.a_login" placeholder="请输入账号..." :disabled="a_login_disable"></Input>
				        </FormItem>
			    	</Col>
	        		<Col span="8">
			        	<FormItem label="密码：" prop="a_Password">
				            <Input v-model="form_item.a_Password" placeholder="请输入密码..."></Input>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="是否启用：">
				            <Select v-model="form_item.a_use">
				                <Option value="1">启用</Option>
				                <Option value="0">禁用</Option>
			            	</Select>
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
	//用户管理
	import util from '@/libs/util'
	let url={
		operate: '/user/operate',
		delete: '/user/delete',
		search: '/user/list'
	}
    let default_form = {
		state: 'add',    	
		a_login:'' , 
		a_Password: '' , 
		a_use: '1' 
	}
	export default{
		name:'userManage',
		data(){
			return {
				delete_modal: false,
				modal_loading: false,
				loading: true ,	
				tb_loading: false ,	
				a_login_disable: false,
				cu_modali: false ,				
				maintb: {
					cur_sel_index:null,
					filter: {
						a_login:''
					},
					total: 0,	
					page_size:20,
					current:1,				
					initTable: [],
					list_data: [],
					list_columns: [
						{ width: 130, key: 'a_login', title: '账号' },
						{ width: 130, key: 'a_Password', title: '密码' },					
						{ width: 110, key: 'a_use', title: '是否启用', sortable: true,
							render:(h,params) => { 
								return params.row.a_use=='1'?'是':'否'
							} 
						},
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
					]
				},
				form_item: {},
	            formRules: {
	                a_login: [
	                    { required: true, message: '请填写账号', trigger: 'blur' }
	                ],
	                a_Password: [
	                    { required: true, message: '请填写密码', trigger: 'blur' }
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
				this.$refs['form_item'].resetFields()
			},

            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: this.show_handle(this.maintb.list_data[index])
                })
            },

            add () {
            	this.form_item= util.deepCopy(default_form)
            	this.a_login_disable=false
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
            	this.form_item.state='edit'
            	this.a_login_disable=true
            	this.cu_modali = true
            },

            del () {
                this.modal_loading = true
                let id=this.maintb.list_data[this.maintb.cur_sel_index].a_id
	        	util.ajax(this).post(url.delete,{a_id:id}).then((res) => {
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
				this.maintb.current=1
				this.getData(1,this.maintb.filter)

			},

			page_size_change(cur){
				this.maintb.current=1
				this.getData(1,this.maintb.filter)
			},

			page_chang(cur){
				this.getData(cur)
			},

			getData(page=1,filter={}){
				this.tb_loading=true
				this.maintb.list_data=[]
	        	util.ajax(this).post(url.search,Object.assign({page:page,page_size:this.maintb.page_size},filter)).then((res) => {
	        		if(res.code){
	        			this.maintb.total=res.total
						this.maintb.list_data=res.data
	        		}
	        		this.tb_loading=false
	        	})
			},

	        handleSubmit () {
	            this.$refs['form_item'].validate((valid) => {
	                if (valid) {
			        	util.ajax(this).post(url.operate,this.form_item).then((res) => {
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
			this.init()
		}
	}
</script>