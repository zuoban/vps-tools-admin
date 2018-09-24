<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keywords" placeholder="" style="width: 300px;" clearable class="filter-item" @keyup.enter.native="fetchData"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" circle @click.native.prevent="fetchData"/>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" circle @click.native.prevent="handleDeleteAll"/>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
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
      <el-table-column align="center" prop="created_at" label="创建日期">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fileSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="operation" width="110" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click.native.prevent="downloadFile(scope.row.id)">download</el-button>
        </template>
      </el-table-column>
    </el-table

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
import { getList, download } from '@/api/userFile'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      listQuery: {
        total: 0,
        page: 1,
        size: 20,
        order: null,
        ext: {}
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$nextTick(() => {
        this.listLoading = true
        getList(this.listQuery).then(({ data }) => {
          this.list = data.content
          const { totalElements } = data
          this.listQuery.total = totalElements
        }).finally(() => {
          this.listLoading = false
        })
      })
    },
    handleDeleteAll() {

    },
    downloadFile(id) {
      download(id)
    }
  }
}
</script>
