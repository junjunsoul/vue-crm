<style lang='less'>
	@import "./record-manage.less";
</style>
<template>
	<div class="record">
		<Button type="primary" icon="plus-round" @click="cu_modali = true">添加客户信息</Button>
		<div class="record-query-card">
		    <Card shadow>
		      <p>搜索条件：</p>
		      <Input v-model="query_c_name" placeholder="输入客户姓名..." style="width: 150px"></Input>
		      <Button type="primary" icon="ios-search">查询</Button>
		    </Card>
	    </div>
		<div class="page">
			<Page :total="100" show-elevator></Page>
		</div>	    
		<Table border height='500' :columns="list_columns" :data="list_data"></Table>

		
	    <Modal
	        v-model="cu_modali"
	        width="850"
	        title="客户信息"
	        @on-ok="ok"
	        @on-cancel="cancel">
	        <Form :model="record_form" :label-width="90" >
	        	<Row>
	        		<Col span="8">	
			        	<FormItem label="客户编码：">
				            <Input v-model="record_form.C_code" placeholder="请输入编码..."></Input>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="客户类型：">
				            <Select v-model="record_form.C_type">
				                <Option value="0">学生</Option>
				                <Option value="1">社会人士</Option>
			            	</Select>
			        	</FormItem>
			        </Col>
	        		<Col span="8">	
			        	<FormItem label="姓名：">
				            <Input v-model="record_form.C_name" placeholder="请输入姓名..."></Input>
				        </FormItem>
			    	</Col>			        
		        </Row>
	        	<Row>
			    	<Col span="8">
			        	<FormItem label="性别：">
				            <Select v-model="record_form.C_sex">
				                <Option value="0">男</Option>
				                <Option value="1">女</Option>
			            	</Select>
				        </FormItem>
			        </Col>	        		
	        		<Col span="8">	
			        	<FormItem label="国家：">
				            <Select v-model="record_form.C_country">
				                <Option value="001">中国</Option>
				                <Option value="002">日本</Option>
			            	</Select>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="区域：">
				            <Select v-model="record_form.C_area">
				                <Option value="01">华南区</Option>
				                <Option value="02">华中区</Option>
			            	</Select>
				        </FormItem>
			        </Col>
		        </Row>
		        <Row>
		        	<Col span="16">
			        	<FormItem label="省/市/区：">
			        		<Row>
			        			<Col span="24">
	                        		<al-selector v-model="record_form.C_p_c" searchable level='2'/>
	                        	</Col>
	                        </Row>			        
                    	</FormItem>
		        	</Col>
	        		<Col span="8">	
			        	<FormItem label="近视时间：">
			        		 <DatePicker type="date" :value="record_form.C_myopia_date" style="width:182px;" placeholder="选择日期"></DatePicker>
				        </FormItem>
			    	</Col>		        	
		        </Row>
	        	<Row>
			    	<Col span="8">
			        	<FormItem label="紧急联系人：">
			        		<Input v-model="record_form.C_emergency_contact" placeholder="请输入联系人..."></Input>
			        	</FormItem>
			        </Col>	        		
	        		<Col span="8">	
			        	<FormItem label="联系电话：">
			        		<Input v-model="record_form.C_contact_phone" placeholder="请输入电话号码..."></Input>
				        </FormItem>
			    	</Col>
			    	<Col span="8">
			        	<FormItem label="联系人类别：">
				            <Select v-model="record_form.C_contact_type">
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
			        		<Input v-model="record_form.C_address" placeholder="请输入详细地址..."></Input>
                    	</FormItem>
		        	</Col>
		        </Row>

		        <Row>
		        	<Col span="24">
			        	<FormItem label="备注：">	
			        		<Input v-model="record_form.C_remark" type="textarea" :rows="4" placeholder="请输入备注..."></Input>
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
	export default{
		name:'userManage',
		data(){
			return {
				query_c_name: '',
				delete_modal: false,
				modal_loading: false,
				cur_sel_index:null,
				list_columns: [
					{ width: 130, key: 'C_code', title: '客戶编号', sortable: true },
					{ width: 130, key: 'C_name', title: '客户姓名', sortable: true },					
					{ width: 130, key: 'C_type', title: '客戶类型', sortable: true },
					{ width: 130, key: 'C_sex', title: '性别', sortable: true },
					{ width: 130, key: 'C_country', title: '国家', },
					{ width: 130, key: 'C_area', title: '区域', },
					{ width: 130, key: 'C_province', title: '省份', },
					{ width: 130, key: 'C_city', title: '城市', },
					{ width: 130, key: 'C_address', title: '详细地址', },
					{ width: 130, key: 'C_myopia_date', title: '近视时间', sortable: true },
					{ width: 130, key: 'C_emergency_contact', title: '紧急联系人', sortable: true },
					{ width: 130, key: 'C_contact_phone', title: '联系人电话', sortable: true },
					{ width: 130, key: 'C_contact_type', title: '联系人类别', sortable: true },
					{ width: 130, key: 'C_default_contact', title: '默认联系人', sortable: true },
					{ width: 130, key: 'C_remark', title: '备注', sortable: true },
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
						C_code :'x00001' , 
						C_type: '学生' , 
						C_name: '陈晓丽' , 
						C_sex: '女' ,
						C_country: '中国' , 
						C_area: '华南区' ,
						C_province: '安徽省',
						C_city: '合肥市',
						C_address: '某某公寓',
						C_myopia_date: '2018-12-30',
						C_emergency_contact: '阿斯巴',
						C_contact_phone: '13277781234',
						C_contact_type: '朋友',
						C_default_contact: '紧急联系人',
						C_remark: '不是本地人不经常出现在本市区',
						C_createdate: '2017-06-23',
						C_updatedate: '2017-05-17',
						C_state: '暂存'
					}
				],
				cu_modali: false ,
				record_form: {
					C_code :'x00001' , 
					C_type: '0' , 
					C_name: '陈晓丽' , 
					C_sex: '1' ,
					C_country: '001' , 
					C_area: '01' ,
					C_p_c:['110000','110100','110101'],
					C_province: '安徽省',
					C_city: '合肥市',
					C_address: '某某公寓',
					C_myopia_date: '2017-12-30',
					C_emergency_contact: '陈旭华',
					C_contact_phone: '13277781234',
					C_contact_type: '0',
					C_default_contact: '紧急联系人',
					C_remark: '不是本地人不经常出现在本市区',
				}
			}
		},
		methods: {
			ok(){
				this.cu_modali=false
			},
			cancel(){
				this.cu_modali=false
			},
            show (index) {
            	
                this.$Modal.info({
                    title: '用户信息',
                    content: this.show_handle(this.list_data[index])
                })
            },
            remove (index) {
            	this.delete_modal = true  
            	this.cur_sel_index = index
            },
            edit (index) {
            	this.cu_modali = true
            	//this.list_data
            },
            del () {
                this.modal_loading = true
                setTimeout(() => {
                    this.modal_loading = false
                    this.delete_modal = false
                    this.$Message.success('删除成功！')
                    this.list_data.splice(this.cur_sel_index, 1)
                }, 500);
            },
			show_handle(data){
				var re_str=''
				this.list_columns.map(item => {
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
		}
	}
</script>