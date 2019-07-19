import Vue from 'vue'
Vue.filter('dateFormat', function(val) {
    const dt = new Date(val);
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let date = dt.getDate();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();
    return year + '年' + month + '月' + date + '日' + ' ' + hours + ':' + minutes + ':' + seconds
})