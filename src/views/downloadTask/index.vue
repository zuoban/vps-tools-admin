<template>
  <div class="app-container">
    <el-form ref="taskForm" :model="form">
      <el-form-item>
        <el-input v-model="form.url" placeholder="请输入下载地址" @keyup.enter.native="handleAddDownloadTask" >
          <el-button slot="append" :loading="loading" icon="el-icon-download" @click.native.prevent="handleAddDownloadTask"/>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="filter-container">
      <el-input v-model="listQuery.keywords" placeholder="" style="width: 300px;" clearable class="filter-item" @keyup.enter.native="fetchData"/>
      <el-select v-model="listQuery.ext.status" clearable class="filter-item" style="width: 130px" @change="fetchData">
        <el-option v-for="(value,key,index) in statusMap" :key="key" :label="value" :value="index"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" circle @click="fetchData"/>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" circle @click.native.prevent="handleDeleteAll"/>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="文件名" >
        <template slot-scope="scope">
          {{ scope.row.filename }}
        </template>
      </el-table-column>
      <el-table-column sortable="custom" align="center" prop="creationTime" label="创建日期">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status === 2" trigger="hover" placement="top">
            <p v-if="scope.row.status === 2">错误信息: {{ scope.row.errorMessage }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag :type="scope.row.status | statusFilter" size="medium">{{ scope.row.status | statusDescFilter }}</el-tag>
            </div>
          </el-popover>
          <el-tag v-if="scope.row.status !== 2" :type="scope.row.status | statusFilter" size="medium">{{ scope.row.status | statusDescFilter }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="listQuery.total"
      :current-page.sync="listQuery.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size.sync="listQuery.size"
      background
      class="pagination-container"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="fetchData"
      @size-change="fetchData"
    />
  </div>
</template>

<script>
import { list, add, deleteAll } from '@/api/downloadTask'

const statusMap = {
  st0: '下载中...',
  st1: '下载完成',
  st2: '下载失败'
}

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        st0: 'gray',
        st1: 'success',
        st2: 'danger'
      }
      const key = 'st' + status
      return statusMap[key]
    },
    statusDescFilter(status) {
      const key = 'st' + status
      return statusMap[key]
    }
  },
  data() {
    return {
      form: {
        url: null
      },
      listQuery: {
        total: 0,
        page: 1,
        size: 20,
        order: null,
        ext: {}
      },
      list: null,
      listLoading: true,
      loading: false,
      statusMap,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$nextTick(() => {
        this.listLoading = true
        list(this.listQuery).then(({ data }) => {
          this.list = data.content
          const { totalElements } = data
          this.listQuery.total = totalElements
        }).finally(() => {
          this.listLoading = false
        })
      })
    },
    handleAddDownloadTask() {
      if (this.form.url) {
        this.loading = true
        add(this.form.url).then(response => {
          this.$notify.success(response.message)
          this.form.url = null
          this.fetchData()
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    handleDeleteAll() {
      const length = this.multipleSelection.length
      if (length > 0) {
        this.$confirm(`是否确认删除选中的${length}条数据`).then(() => {
          const ids = this.multipleSelection.map(task => task.id).join(',')
          deleteAll(ids).then(({ message }) => {
            this.$notify.success(message)
            this.fetchData()
          }).catch(({ message }) => {
            this.$notify.error(message)
          })
        })
      } else {
        this.$notify.error('请选择要删除的数据！')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSortChange(col) {
      if (col.prop) {
        const direction = col.order === 'ascending' ? 'asc' : 'desc'
        this.listQuery.order = col.prop + ' ' + direction
        this.fetchData()
      }
    }
  }
}
</script>
