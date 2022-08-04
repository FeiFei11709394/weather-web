<template>
    <el-container style="justify-content: center; position: absolute; width: 100%;height: 100%;">
        <el-header>
            <el-tooltip :disabled="search ? false : true" placement="bottom" :open-delay="open_delay_time">
                <div slot="content">{{search}}</div>
                <el-input
                        placeholder="请输入运行环境名称"
                        clearable
                        v-model="search"
                        @keyup.enter.native="getData"
                        :disabled="loading"
                >
                    <el-button slot="append" icon="el-icon-search" @click="getData" :disabled="loading">搜索</el-button>
                </el-input>
            </el-tooltip>
        </el-header>
        <el-main>
            <div :style="back" v-if="! weather_data.dataseries.length">

            </div>

            <div v-else>
                <el-table
                        :data="weather_data.dataseries"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column
                            prop="timepoint"
                            label="小时"
                            width="180">
                    </el-table-column>

                    <el-table-column
                            prop="temp2m"
                            label="溫度">
                    </el-table-column>

                    <el-table-column
                            prop="cloudcover"
                            label="云层"
                            width="180">
                    </el-table-column>

                    <el-table-column
                            prop="seeing"
                            label="能见度">
                    </el-table-column>

                    <el-table-column
                            prop="rh2m"
                            label="相對濕度">
                    </el-table-column>

                    <el-table-column
                            prop="lifted_index"
                            label="提升指數"
                            width="180">
                    </el-table-column>

                    <el-table-column
                            prop="transparency"
                            label="大氣透明度">
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </el-container>
</template>

<script>

    export default {
        name: "Home",
        data() {
            return {
                loginForm: {
                    user_name: 'root',  // 账号/ 密码获取token
                    password: '123456',
                },
                back:{
                    backgroundImage: "url(" + require("../../assets/home_back.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: '106% 106%' ,
                    backgroundPosition:'10% 10%',
                    height: '100%'
                },
                search: null,
                open_delay_time: 1000, // 悬浮框，延迟打开时间
                loading: false,
                weather_data: {dataseries: [], init: "", product: ""}
            };
        },
        methods: {
            // 登录成功处理
            handleLoginSuccess(resp) {

                if (resp.success) {
                    this.setLocalValue("token", resp.data.token);
                } else {
                    this.fail(resp.msg)
                }
            },
            // 登录
            toLogin() {
                this.$api.login(this.loginForm).then(resp => {
                    this.handleLoginSuccess(resp)
                })
            },
            // 此处应调用百度API 获取对应的经纬度
            cityToLonAndLat(){
                // http://api.map.baidu.com/geocoder/v2
                // this.search
                return {
                    lon: "113.17",
                    lat: "23.09",
                    product: "astro",
                }
            },
            // 获取天气信息
            getData(){

                if(this.search){
                    this.loading = true;

                    const params = this.cityToLonAndLat();
                    this.$api.weather({
                            params: params
                        }
                    ).then(resp => {
                        if(resp.success){
                            this.$message.success({
                                message: resp.msg,
                                duration: 1000,
                            });
                            this.weather_data = resp.data
                        }else{
                            this.fail(resp.msg);
                            this.weather_data = {dataseries: [], init: "", product: ""};
                        }
                    }).catch(()=>{
                        this.weather_data = {dataseries: [], init: "", product: ""};
                    }).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.$message.info({
                        message: '请输入城市名称',
                        duration: 2000,
                    })
                }


            },
            // 列表行设置颜色
            tableRowClassName({row, rowIndex}) {
                if (row.temp2m >= 30) {
                    return 'hot-row';
                } else if (row.temp2m < 25) {
                    return 'cold-row';
                }
                return '';
            },
            fail(msg){
                this.$message.error({
                    message: msg,
                    duration: 2000,
                    center: true
                })
            }
        },
        mounted(){
            // 登录
            this.toLogin()
        },
        created() {
            // 清空token
            sessionStorage.removeItem('token')
        },
    };
</script>

<style scoped>
    /deep/ .el-table .hot-row {
        background: oldlace;
    }

    /deep/ .el-table .cold-row {
        background: #f0f9eb;
    }
</style>
