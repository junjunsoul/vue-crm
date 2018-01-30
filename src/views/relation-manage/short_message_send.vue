<style lang='less'>
	@import "./short_message_send.less";
</style>
<template>
	<div class="s_msg_send">
		<div class="c_list">
		    <Transfer
		        :data="mockData"
		        :target-keys="formdata.targetKeys"
		        :list-style="listStyle"
		        :render-format="render_format"
		        :titles="['客户列表', '已选客户']"
		        filterable
		        @on-change="handleChange">
		        <div :style="{float: 'right', margin: '5px'}">
		            <Button type="ghost" size="small" @click="reloadMockData">刷新</Button>
		        </div>
		    </Transfer>
		</div>

		<div class="tag">
			<span>标签：</span>
		    <ButtonGroup>
		        <Button @click="addTag('@data ')">@她人</Button>
		    </ButtonGroup>
		</div>
		<Input v-model="formdata.msgText" type="textarea" :rows="10" placeholder="请输入短信模板内容..."></Input>
		<div class="send">
			<DatePicker type="datetime" :editable="false" placement="top-start" v-model="formdata.sendTime" :options="timeOption" format="yyyy-MM-dd HH:mm" placeholder="选择发送时间" style="width: 200px"></DatePicker>
			<Button type="success" @click="send" :loading="loading">提交</Button>
		</div>
	</div>
</template>
<script>
	//短信发送页面
	let url={
		list: '/bar',
		send: '/bar'
	}
	import util from '@/libs/util'
	export default{
		name:'short_message_send',
		data(){
			return {
                mockData:[],
                loading:false,
                listStyle: {
                    width: '380px',
                    height: '407px',
                    backgroundColor:'#fff'
                },
				formdata:{
					targetKeys: [],
					sendTime :null,
					msgText: ''
				},
				timeOption:{
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
				}
			}
		},
        methods: {
        	init() {
        		this.getMockData()
        	},
        	addTag(tag) {
        		this.formdata.msgText+=tag
        	},
            getMockData () {
                let mockData = []
                util.ajax.post(url.list,{}).then((res) => {
                	if(res.code){
                        res.data.map((item) => {
                            mockData.push({
                                key: item.C_id.toString(),
                                label:item.C_name.toString(),
                                description: item.C_type+' 年龄'+item.age
                            })
                        })
                	}
                    this.mockData=mockData
                })
            },
            handleChange (newTargetKeys) {
                this.formdata.targetKeys = newTargetKeys
            },
            render_format (item) {
                return item.label + ' - ' + item.description
            },
            reloadMockData () {
                this.getMockData()
                this.formdata.targetKeys = []
            },
            send() {
            	for(let i in this.formdata){
            		if(!this.formdata[i]||!this.formdata.targetKeys.length){
		                this.$Notice.warning({
		                    title: '内容缺失',
		                    desc: '请选择客户，填写短信模板，选择发送时间！'
		                });
            			return
            		}
            	}
                this.loading=true
                util.ajax.post(url.send,this.formdata).then((res) => {
                	if(res.code){
                		this.$Message.success('提交成功!');
                	}else{
                		this.$Message.error('提交失败！');
                	}
                    this.loading=false
                })
            }
        },
        mounted () {
        	this.init()
        }
	}
</script>