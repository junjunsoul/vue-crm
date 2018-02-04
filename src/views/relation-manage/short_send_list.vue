<style lang='less'>
	@import "./short_send_list.less";
</style>
<template>
	<div class="short">
		<div class="short-query-card">
		    <Card shadow>
		      <p>搜索条件：</p>
		      <Input v-model="maintb.filter.c_name" placeholder="输入账号..." style="width: 150px"></Input>
		      
		      <Button type="primary" icon="ios-search" @click="sever_search">查询</Button>
		    </Card>
	    </div>
		<div class="page">
			<Row>
				<Col span="20" order="1">
					<Page :total="maintb.total" show-elevator @on-change="page_chang" @on-page-size-change="page_size_change" :page-size="maintb.page_size" :current="maintb.current" :page-size-opts="[20,40,50]" show-sizer  show-total></Page>
				</Col>
				<Col span="4" order="2" style="text-align: right;">
				    <Tooltip content="导出表格" placement="left-start" >
					 	<Button type="text" size="small" @click="exportData('短信列表')">
					 		<Icon type="ios-download" style="font-size: 23px"></Icon>
					 	</Button>
				    </Tooltip>
				</Col>
			</Row>
		</div>
		<Table border height='500' :loading="tb_loading" :columns="maintb.list_columns" :data="filter_tb_data" ref="tableCsv"></Table>
	</div>
</template>
<script>
	//客户关系管理
	import util from '@/libs/util'
	let url={
		search: '/short/list'
	}
	export default{
		name:'short_send',
		data(){
			return {
				maintb: {
					cur_sel_index:null,
					filter: {
						c_name:''
					},
					total: 0,
					page_size: 20,
					current: 1,					
					initTable: [],
					list_data: [],
					list_columns: [
						{ width: 130, key: 'c_name', title: '客户名称' },
						{ width: 300, key: 's_content', title: '内容' },					
						{ width: 130, key: 's_sendTime', title: '发送时间' },					
						{ width: 130, key: 's_enterTime', title: '录入时间' },					
						{ width: 130, key: 's_operator', title: '操作员' },					
						{ width: 50, key: 'Action', title: ' ', fixed: 'right', 
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
	                                }, '')
	                            ]);
							}
						}
					]
				},
			}
		},
		methods: {
			init(){
				this.getData()
			},

            show (index) {
                this.$Modal.info({
                    title: '短信内容',
                    content: this.show_handle(this.maintb.list_data[index])
                })
            },

            exportData (title){
                this.$refs.tableCsv.exportCsv({
                    filename: title,
                    original: false
                });
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

			page_size_change(cur){
				this.maintb.current=1
				this.getData(1,this.maintb.filter)
			},

			sever_search(){
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