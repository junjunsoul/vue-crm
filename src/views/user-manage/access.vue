<style lang="less">
    @import './access.less';
</style>

<template>
<div>
<al-selector 
    v-model="C_p_c"
    data-type="name"
    level="2"
    auto
/>
<al-cascader
    v-model="C_p_c"
    data-type="name"
    level="2"
    auto
/>
<Button type="dashed" @click="func" >Dashed</Button>
</div>
</template>

<script>
export default {
    name: 'access_index',
    data () {
        return {
            C_p_c:[]
        };
    },
    computed: {

    },
    methods: {
        func(){
            this.C_p_c=["北京市", "市辖区", "东城区"]
        }
    },
    watch:{
        C_p_c(val){
            console.log(val)
        }
    }
};
</script>

<style>

</style>
