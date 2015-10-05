/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-datepicker', {
    props: ['prompt', 'dateLabel'],

    template :
        '<div class="vue-datepicker">' +
            '<input class="form-control vue-datepicker-input" type="text" v-on="click:inputClick" v-model="value"/>' +
            '<div class="vue-datepicker-popup" v-style="display:popupDisplay">' +
                '<div class="vue-datepicker-inner">' +
                    '<div class="vue-datepicker-head">' +
                        '<div class="vue-datepicker-label">{{prompt}}</div>' +
                    '</div>' +
                    '<div class="vue-datepicker-body">' +
                        '<div class="vue-datepicker-ctrl">' +
                            '<i class="vue-month-btn vue-datepicker-preMonthBtn" v-on="click:preNextMonthClick(0)">&lt;</i>' +
                            '<i class="vue-month-btn vue-datepicker-nextMonthBtn" v-on="click:preNextMonthClick(1)">&gt;</i>' +
                            '<p>{{displayDateLabel(currDate)}}</p>' +
                        '</div>' +
                        '<div class="vue-datepicker-weekRange">' +
                            '<span v-repeat="w:weekRange">{{w}}</span>' +
                        '</div>' +
                        '<div class="vue-datepicker-dateRange">' +
                            '<span v-repeat="d:dateRange" v-class="d.sclass" v-on="click:itemClick(d.date)">{{d.text}}</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        var today = new Date
        return {
            config : {},
            value : '',
            prompt : 'Select date',
            dateLabel : '{mmmm} {yyyy}',
            weekRange : ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            weekRangeTH : ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'],
            dateRange : [], // we need to draw a date range
            currDate : new Date, // the current date
            popupDisplay : 'none',
            month : [
                'January', 'February', 'March', 
                'April', 'May', 'June', 
                'July', 'August', 'September', 
                'October', 'November', 'December'
            ],
            shortMonth : [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ],
            monthTH : [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 
                'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 
                'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ],
            shortMonthTH : [
                'ม.ค.', 'ก.พ.', 'มี.ค.', 
                'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                'ก.ค.', 'ส.ค.', 'ก.ย.', 
                'ต.ค.', 'พ.ย.', 'ธ.ค.'
            ]
        }
    },
    watch : {
        currDate : function (){
            this.getDateRange()
        },
        value : function (){
            var valueDate = this.parse(this.value)
            if (valueDate){
                this.currDate = valueDate
            }
        }
    },
    methods : {
        inputClick : function (e){
            this.popupDisplay = this.popupDisplay=='none' ? 'block' : 'none'
        },
        displayDateLabel: function(date) {
            var pattern = this.dateLabel || "{mmm} {yyyy}"
            return this.stringify(date, pattern)
        },
        preNextMonthClick : function (flag){
            var year = this.currDate.getFullYear()
            var month = this.currDate.getMonth()
            var date = this.currDate.getDate()

            if (flag == 0){
                var preMonth = this.getYearMonth(year, month-1)
                this.currDate = new Date(preMonth.year, preMonth.month, date)
            }
            else {
                var nextMonth = this.getYearMonth(year, month+1)
                this.currDate = new Date(nextMonth.year, nextMonth.month, date)
            }
        },
        itemClick : function (date){
            this.currDate = date
            this.value = this.stringify(this.currDate)
            this.popupDisplay = 'none'
        },
        getYearMonth : function (year, month){
            if (month > 11){
                year++
                month = 0
            }
            else if (month < 0){
                year--
                month = 11
            }
            return {year:year, month:month}
        },
        stringify : function (date, format){
            format = format || '{dd} {mmmm} {yyyy}'

            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()

            var dt = format
                .replace('{yyyy}', year)
                .replace('{yyyy:th', year + 543)
                .replace('{mmmm}', this.month[month-1])
                .replace('{mmmm:th}', this.monthTH[month-1])
                .replace('{mmm}', this.shortMonth[month-1])
                .replace('{mmm:th', this.shortMonthTH[month-1])
                .replace('{mm}', ('0'+month).slice(-2))
                .replace('{dd}', ('0'+day).slice(-2))
                .replace('{yy}', year)
                .replace('{m}', month)
                .replace('{d}', day)
            console.log('date: ', date, 'format: ', dt)
            return dt
        },
        parse : function (str){
            var date = new Date(str)
            return isNaN(date.getFullYear()) ? null : date
        },
        getDayCount : function (year, month){ //return the total number of days per month
            var dict = [31,28,31,30,31,30,31,31,30,31,30,31]

            //if February
            if (month == 1){
                // check if it's the leap year
                if ( (year%400==0) || (year%4==0 && year%100!=0) ){
                    return 29
                }
                return 28
            }

            return dict[month]
        },
        getDateRange : function (){
            this.dateRange = []

            var time = {
                year : this.currDate.getFullYear(),
                month : this.currDate.getMonth(),
                day : this.currDate.getDate()
            }
            //the first day of the month
            var currMonthFirstDay = new Date(time.year, time.month, 1)
            //check current month if it's the first day of the week?
            var firstDayWeek = currMonthFirstDay.getDay()
            if (firstDayWeek == 0){
                firstDayWeek = 7
            }
            //the total number of days in this month
            var dayCount = this.getDayCount(time.year, time.month)

            //If you need to make up last month
            if (firstDayWeek > 1){
                var preMonth = this.getYearMonth(time.year, time.month-1)

                //the total number of days in last month
                var prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month)
                for (var i=1; i<firstDayWeek; i++){
                    var dayText = prevMonthDayCount - firstDayWeek + i + 1
                    this.dateRange.push({
                        text : dayText,
                        date : new Date(preMonth.year, preMonth.month, dayText),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }

            //this month
            for (var i=1; i<=dayCount; i++){
                var date = new Date(time.year, time.month, i)
                var week = date.getDay()
                var sclass = ''
                if (week==6 || week==0){
                    sclass = 'vue-datepicker-item-red'
                }
                // if i == current day
                if (i==time.day){
                    // if value is not null
                    if (this.value){
                        var valueDate = this.parse(this.value)
                        // if the value is a valid date
                        if (valueDate){
                            // if it's the current date
                            if (valueDate.getFullYear() == time.year && valueDate.getMonth() == time.month){
                                sclass = 'vue-datepicker-dateRange-item-hover'
                            }
                        }
                    }
                }
                this.dateRange.push({
                    text : i,
                    date : date,
                    sclass : sclass
                })
            }

            // If you need to make up for next month
            if (this.dateRange.length < 42){
                //The number of days required to make up
                var nextMonthNeed = 42 - this.dateRange.length
                var nextMonth = this.getYearMonth(time.year, time.month+1)

                for (var i=1; i<=nextMonthNeed; i++){
                    this.dateRange.push({
                        text : i,
                        date : new Date(nextMonth.year, nextMonth.month, i),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }
        }
    },
    compiled : function (){
        var me = this
        me.getDateRange()

        VueUI.winClick(me.$el, function (){
            me.popupDisplay = 'none'
        })
    }
})