<template>
    <div>
        {{ruleForm}}
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
                <!-- <el-input :value="ruleForm.password" @input="v=>ruleForm.password=v"></el-input> -->
            </el-form-item>
            <el-form-item>
                <button @click="submitForm">提交表单</button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import elForm from "./components/el-form";
import elFormItem from "./components/el-form-item";
import elInput from "./components/el-input";

export default {
    components: {
        "el-form": elForm,
        "el-form-item": elFormItem,
        "el-input": elInput
    },
    data() {
        return {
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    alert('通过');
                } else {
                    alert('失败');
                }
            });
        }
    }
};
</script>

<style>
</style>
 
// el-form:form表单，提供 model rules
// el-form-item: 渲染label prop属性用来校验是否符合规则，（不通过需要渲染错误信息）
// el-input：实现双向绑定的输入框 