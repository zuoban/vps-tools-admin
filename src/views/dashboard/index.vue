<template>
  <div class="dashboard-container">
    <el-form ref="taskForm" :model="form" :rules="rules">
      <el-form-item>
        <el-input v-model="form.url" placeholder="请输入下载地址" >
          <el-button slot="append" :loading="loading" icon="el-icon-plus" @click.native.prevent="handleAddDownloadTask"/>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { add } from '@/api/downloadTask'

export default {
  name: 'Dashboard',
  data() {
    return {
      form: {
        url: null
      },
      rules: {
        url: [{ required: true }]
      },
      url: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    handleAddDownloadTask() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.loading = true
          add(this.form.url).then(response => {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.from.url = null
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
