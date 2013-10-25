// This is a JavaScript file
/* Copyright&copy;2013 System Lab, Ltd. All Rights Reserved. */

var g_configure;
var g_stimeTable;
var g_etimeTable;
var g_workType;
var g_restTime;
var g_workData;
var g_holidays;
var g_date;
var g_today;

// 共通の初期設定
$(document).bind('mobileinit', function(){

    // 日本語化
    $.mobile.loadingMessage = '読込み中';
    $.mobile.pageLoadErrorMessage = '読込みに失敗しました';
    $.mobile.page.prototype.options.backBtnText = '戻る';
    $.mobile.dialog.prototype.options.closeBtnText = '閉じる';
    $.mobile.selectmenu.prototype.options.closeText= '閉じる';
    $.mobile.listview.prototype.options.filterPlaceholder = '検索文字列...';
    
});
function fileSystemFail(error) { alert('ファイルシステムエラー。エラーコード: ' + error.code); }

//--------------------------------------------------------------------------------------------
// UI: TopPage
//
//
function csvListOpen() {
    //Create CSV File and Send Mail
    var str = createCSVFile();
    var subject =
                  "【" + g_date.getFullYear() + "年" + ("0"+(g_date.getMonth()+1)).slice(-2) + "月度】"
                  + g_configure.fileTitle.value
                  + "（" + g_configure.UserName.value.trim() + "）";
    var to      = g_configure.toAddress.value;
    var body    = str.replaceAll('\n','%0D%0A');
    location.href='mailto:'+to+'?subject='+subject+'&body='+body;
}

// set monthly data
function setMonthlyData(date){

    var monthly = getMonthlyData(date);
    document.getElementById('sdays').innerHTML    = monthly.sday.toFixed(1); //就業日数
    document.getElementById('kdays').innerHTML    = monthly.kday.toFixed(1); //勤務日数
    document.getElementById('ydays').innerHTML    = monthly.yday.toFixed(1); //有休日数
    document.getElementById('ddays').innerHTML    = monthly.dday.toFixed(1); //代休日数
    document.getElementById('tdays').innerHTML    = monthly.tday.toFixed(1); //特休日数
    document.getElementById('adays').innerHTML    = monthly.aday.toFixed(1); //欠勤日数
    document.getElementById('odays').innerHTML    = monthly.oday.toFixed(1); //その他休暇日数
    document.getElementById('mworkSum').innerHTML = monthly.work.toFixed(2);  //実働時間
    document.getElementById('mrestSum').innerHTML = monthly.rest.toFixed(2);  //休憩時間
    document.getElementById('moverSum').innerHTML = monthly.over.toFixed(2);  //平日所定外時間
    document.getElementById('mnghtSum').innerHTML = monthly.nght.toFixed(2);  //平日深夜時間
    document.getElementById('mhovrSum').innerHTML = monthly.hovr.toFixed(2);  //休日所定外時間
    document.getElementById('mhngtSum').innerHTML = monthly.hngt.toFixed(2);  //休日深夜時間
}

function createListView() {

    var y = g_date.getFullYear();
    var m = g_date.getMonth();

    for(var i=1; i<=31; i++) {

        var idate = new Date(y,m,i);

        if(idate == null || m != idate.getMonth()) break;

        var ymd = idate.YYYYbMMbDD();

        holidayText = (g_holidays[ymd]== undefined) ? "　" : g_holidays[ymd].text;

        if(isHoliday(g_holidays,idate)) {
            dayColor = 'color:red';
            dayTheme = 'data-theme="c"';
        }
        else {
            dayColor = 'color:black';
            dayTheme = 'data-theme="c"';
        }

        if(g_workData[ymd] != undefined) {
            var type  = g_workData[ymd].workType;
            var stime = g_workData[ymd].startTime;
            var etime = g_workData[ymd].endTime;
            var rtime = g_workData[ymd].restTime;
            var tbl = getDailyData(idate,type,stime,etime,rtime);
            var ov = tbl.over + tbl.hovr;
            var ng = tbl.nght + tbl.hngt;
            workType = g_workType[type].text;
            workTime = tbl.work.toFixed(2) + " ( " + tbl.start + " - " + tbl.end + " )";
            overTime = "所定外：" + ov.toFixed(2) + " / " + ng.toFixed(2);
            orstTime = "他：" + tbl.orst.toFixed(2) + "   " + g_workData[ymd].restComment;
            workComm = g_workData[ymd].workComment;
            typeColor = (type == "000") ? 'color:red' : 'color:black';
        }
        else {
            workType = g_workType['000'].text;
            workTime = "0.00" + " ( " + "0:00" + " - " + "0:00" + " )";
            overTime = "所定外：" + "0:00" + " ／ " + "0:00";
            orstTime = "その他：";
            workComm = "　";
            typeColor = 'color:red';
        }
        
        //Today's color set
        var todayStyle = "";
        if(g_today == ymd){
            todayStyle = "class='row_today'"
        }
        
        str = '<li ';
        str = str + dayTheme;
        str = str + " dateIndex=" + ymd + " ";
        str = str + todayStyle;
        str = str + '>';
        str = str + '<div class="btnEditDayData">';
        str = str + '<table class="sepTable">';
        str = str + '<tr><!-- １行目 -->';
        str = str + '<td style="width:4%"  class="cal_day_week" id="cal_day_week">';
        str = str + idate.getDayName();
        str = str + '</td>';
        str = str + '<td style="width:10%;';
        str = str + dayColor;
        str = str + '" class="cal_day_date" id="cal_day_date" rowspan="2">';
        str = str + i;
        str = str + '</td>';
        str = str + '<td style="width:43%;';
        str = str + typeColor;
        str = str + '" class="cal_day_kinm" id="cal_day_kinm">';
        str = str + workType;
        str = str + '</td>';
        str = str + '<td style="width:43%" class="cal_day_over" id="cal_day_over">';
        str = str + overTime;
        str = str + '</td>';
        str = str + '</tr>';
        str = str + '<tr><!-- ２行目 -->';
        str = str + '<td ></td>';
        str = str + '<td class="cal_day_work" id="cal_day_work">';
        str = str + workTime;
        str = str + '</td>';
        str = str + '<td class="cal_day_nght" id="cal_day_nght">';
        str = str + orstTime;
        str = str + '</td>';
        str = str + '</tr>';
        str = str + '<tr><!-- ３行目 -->';
        str = str + '<td class="cal_day_holi" colspan="2">';
        str = str + holidayText;
        str = str + '</td>';
        str = str + '<td class="cal_day_biko" colspan="2">';
        str = str + workComm;
        str = str + '</td>';
        str = str + '</tr>';
        str = str + '</table>';
        str = str + '</div>';
        str = str + '</li>';

        $('#listView').append(str);
    }
    $('#listView').listview('refresh');
    
    //Add Event Bind
    $('.btnEditDayData').bind("click", openEditDayData);
}

function prevMonth(event, ui) {

    var y = g_date.getFullYear();
    var m = g_date.getMonth()-1;
    g_date = new Date(y,m,1);

    // set title
    document.getElementById('title_ym').innerHTML = g_date.getFullYear() + "年 " +  (g_date.getMonth()+1) + "月";

    // remove list View
    document.getElementById("listView").removeChildren();

    // create Date List View
    createListView();

    // set monthly report
    setMonthlyData(g_date);
}

function nextMonth(event, ui) {
    
    var y = g_date.getFullYear();
    var m = g_date.getMonth()+1;
    g_date = new Date(y,m,1);

    // set title
    document.getElementById('title_ym').innerHTML = g_date.getFullYear() + "年 " +  (g_date.getMonth()+1) + "月";

    // remove list View
    document.getElementById("listView").removeChildren();

    // create Date List View
    createListView();

    // set monthly report
    setMonthlyData(g_date);
}

//ページが表示されるたびに実行する
$(document).on('pageshow', '#TopPage', function() {
    //ページ表示処理を行う
    showTopPage();
});

//ページが初めて読み込まれたとき１回だけ実行する
$(document).on('pageinit', '#TopPage', function() {

    // select in today
    g_date = new Date();
    g_today = g_date.YYYYbMMbDD();

    // Load Data and Init Store
    g_configure  = loadStorageHashData(tbl_configure,def_configure,atr_configure);
    g_workType   = loadStorageHashData(tbl_workType,def_workType,atr_workType);
    g_stimeTable = loadStorageHashData(tbl_stimeTable,def_stimeTable,atr_stimeTable);
    g_etimeTable = loadStorageHashData(tbl_etimeTable,def_etimeTable,atr_etimeTable);
    g_restTime   = loadStorageHashData(tbl_restTime,def_restTime,atr_restTime);
    g_workData   = loadStorageHashData(tbl_workData,def_workData,atr_workData);
    g_holidays   = loadStorageHashData(tbl_holidays,def_holidays,atr_holidays);

    // bind button function
    $('#prevMonth').bind("vclick", prevMonth);
    $('#nextMonth').bind("vclick", nextMonth);
    $('#csvListOpen').bind("vclick", csvListOpen);

　　// list view selection control
    $(this).on('vclick', '#listView li', function(){
        g_date = new Date($(this).attr('dateIndex'));
    });
    
    // Set Selection Menu
    document.getElementById('editDayData_workType').appendChildren(g_workType);
    document.getElementById('editDayData_startTime').appendChildren(g_stimeTable);
    document.getElementById('editDayData_endTime').appendChildren(g_etimeTable);
    document.getElementById('editDayData_restTime').appendChildren(g_restTime);

    // bind button function
    $('#editDayData_saveDayDate').bind("vclick", editDayData_saveDayDate);
    $('#editDayData_deleteDayDate').bind("vclick", editDayData_deleteDayDate);
    
    //Popup Configure
    document.getElementById('Configure_workType').appendChildren(g_workType);
    document.getElementById('Configure_startTime').appendChildren(g_stimeTable);
    document.getElementById('Configure_endTime').appendChildren(g_etimeTable);
    document.getElementById('Configure_restTime').appendChildren(g_restTime);

    // bind button function
    $('#Configure_saveData').bind("vclick", Configure_saveData);
    
    //Event Add
    $('#toolbar').bind("swiperight", prevMonth);      //スワイプ操作(右)
    $('#toolbar').bind("swipeleft", nextMonth);       //スワイプ操作(左)
    $('#btnConfigure').bind("click", openConfigure);
});

//--------------------------------------------------------------------------------------------
// UI: editDayData
//
//
function editDayData_setMenuEnable(workType){
    if("1"==g_workType[workType].startFlag)
        $('#editDayData_startTime').selectmenu('enable');
    else
        $('#editDayData_startTime').selectmenu('disable');

    if("1"==g_workType[workType].endFlag)
        $('#editDayData_endTime').selectmenu('enable');
    else
        $('#editDayData_endTime').selectmenu('disable');

    if("1"==g_workType[workType].restFlag){
        $('#editDayData_restTime').selectmenu('enable');
        $('#editDayData_restComment').textinput('enable');
    }
    else{
        $('#editDayData_restTime').selectmenu('disable');
        $('#editDayData_restComment').textinput('disable');
        document.getElementById('editDayData_restComment').value = "";
    }

    $('#editDayData_startTime').selectmenu('refresh');
    $('#editDayData_endTime').selectmenu('refresh');
    $('#editDayData_restTime').selectmenu('refresh');
}

function editDayData_onSelWorkType(selectedIndexId) {
    skey = g_workType[selectedIndexId].startKey;
    ekey = g_workType[selectedIndexId].endKey;
    document.getElementById('editDayData_startTime').selectedChange(skey);
    document.getElementById('editDayData_endTime').selectedChange(ekey);
    document.getElementById('editDayData_restTime').selectedChange("000");
    editDayData_setMenuEnable(selectedIndexId);
}

function editDayData_saveDayDate(){

    var record;

    if(g_workData[g_date.YYYYbMMbDD()] == undefined) {
        record = new Object();
    }
    else {
        record = g_workData[g_date.YYYYbMMbDD()];
    }

    var tindex = document.getElementById('editDayData_workType').selectedIndex;
    var sindex = document.getElementById('editDayData_startTime').selectedIndex;
    var eindex = document.getElementById('editDayData_endTime').selectedIndex;
    var rindex = document.getElementById('editDayData_restTime').selectedIndex;

    record.key          = g_date.YYYYbMMbDD();
    record.workType     = document.getElementById('editDayData_workType').options[tindex].id;
    record.startTime    = document.getElementById('editDayData_startTime').options[sindex].id;
    record.endTime      = document.getElementById('editDayData_endTime').options[eindex].id;
    record.restTime     = document.getElementById('editDayData_restTime').options[rindex].id;
    record.workComment  = document.getElementById('editDayData_workComment').value;
    record.restComment  = document.getElementById('editDayData_restComment').value;

    // error check
    if("1"==g_workType[record.workType].startFlag){
        if("000"==record.startTime){
            alert("勤務時間を設定してください");
            return;
        }
    }
    if("1"==g_workType[record.workType].endFlag){
        if("000"==record.endTime){
            alert("勤務時間を設定してください");
            return;
        }
    }
    if("1"==g_workType[record.workType].startFlag || "1"==g_workType[record.workType].endFlag){
        if(g_stimeTable[record.startTime].etCheck > record.endTime){
            alert("開始時間、終了時間を正しく設定してください");
            return;
        }
        if(g_etimeTable[record.endTime].stCheck < record.startTime){
            alert("開始時間、終了時間を正しく設定してください");
            return;
        }
    }

    g_workData[g_date.YYYYbMMbDD()] = record;
    storeHashData(tbl_workData,g_workData,atr_workData);
    //k.tani add ページ表示処理を行う
    showTopPage();
    $('#editDayData').popup('close');
}

function editDayData_deleteDayDate(){

    if(g_workData[g_date.YYYYbMMbDD()] != undefined) {
        delete g_workData[g_date.YYYYbMMbDD()];
        storeHashData(tbl_workData,g_workData,atr_workData);
    }
    //ページ表示処理を行う
    showTopPage();
    $('#editDayData').popup('close');
}

//ページが表示されるたびに実行する
$(document).on('popupafteropen', '#editDayData', function() {
               
    // set title
    document.getElementById('editDayData_title_ymd' ).innerHTML = g_date.YYYYnMMyDDh() + g_date.kWk();
    document.getElementById('editDayData_title_name').innerHTML = g_configure['UserName'].value + " さん";
               
    // modified select menu
    if(g_workData[g_date.YYYYbMMbDD()] == undefined){
        document.getElementById('editDayData_workType').selectedChange(g_configure['workType'].value);
        document.getElementById('editDayData_startTime').selectedChange(g_configure['startTime'].value);
        document.getElementById('editDayData_endTime').selectedChange(g_configure['endTime'].value);
        document.getElementById('editDayData_restTime').selectedChange(g_configure['restTime'].value);
        document.getElementById('editDayData_workComment').value = g_configure["workComment"].value;
        document.getElementById('editDayData_restComment').value = g_configure["restComment"].value;
        editDayData_setMenuEnable(g_configure['workType'].value);
     }
     else {
        document.getElementById('editDayData_workType').selectedChange(g_workData[g_date.YYYYbMMbDD()].workType);
        document.getElementById('editDayData_startTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].startTime);
        document.getElementById('editDayData_endTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].endTime);
        document.getElementById('editDayData_restTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].restTime);
        document.getElementById('editDayData_workComment').value = g_workData[g_date.YYYYbMMbDD()].workComment;
        document.getElementById('editDayData_restComment').value = g_workData[g_date.YYYYbMMbDD()].restComment;
        editDayData_setMenuEnable(g_workData[g_date.YYYYbMMbDD()].workType);
     }
    $('#editDayData_workType').selectmenu('refresh');
               
    //ポップアップを閉じるためのおまじない
    $("#editDayData").popup({history: false});
});

//--------------------------------------------------------------------------------------------
// UI: Configure
//
//
function Configure_setMenuEnable(workType){

    if("1"==g_workType[workType].startFlag)
        $('#Configure_startTime').selectmenu('enable');
    else
        $('#Configure_startTime').selectmenu('disable');

    if("1"==g_workType[workType].endFlag)
        $('#Configure_endTime').selectmenu('enable');
    else
        $('#Configure_endTime').selectmenu('disable');

    if("1"==g_workType[workType].restFlag){
        $('#Configure_restTime').selectmenu('enable');
        $('#Configure_restComment').textinput('enable');
    }
    else{
        $('#Configure_restTime').selectmenu('disable');
        $('#Configure_restComment').textinput('disable');
        document.getElementById('Configure_restComment').value = "";
    }

    $('#Configure_startTime').selectmenu('refresh');
    $('#Configure_endTime').selectmenu('refresh');
    $('#Configure_restTime').selectmenu('refresh');
}

function Configure_onSelWorkType(selectedIndexId) {
    skey = g_workType[selectedIndexId].startKey;
    ekey = g_workType[selectedIndexId].endKey;
    document.getElementById('Configure_startTime').selectedChange(skey);
    document.getElementById('Configure_endTime').selectedChange(ekey);
    document.getElementById('Configure_restTime').selectedChange("000");
    Configure_setMenuEnable(selectedIndexId);
}

function Configure_saveData() {

    var tindex = document.getElementById('Configure_workType').selectedIndex;
    var sindex = document.getElementById('Configure_startTime').selectedIndex;
    var eindex = document.getElementById('Configure_endTime').selectedIndex;
    var rindex = document.getElementById('Configure_restTime').selectedIndex;

    var workType     = document.getElementById('Configure_workType').options[tindex].id;
    var startTime    = document.getElementById('Configure_startTime').options[sindex].id;
    var endTime      = document.getElementById('Configure_endTime').options[eindex].id;
    var restTime     = document.getElementById('Configure_restTime').options[rindex].id;

    // error check
    if("1"==g_workType[workType].startFlag){
        if("000"==startTime){
            alert("勤務時間を設定してください");
            return;
        }
    }
    if("1"==g_workType[workType].endFlag){
        if("000"==endTime){
            alert("勤務時間を設定してください");
            return;
        }
    }
    if("1"==g_workType[workType].startFlag || "1"==g_workType[workType].endFlag){
        if(g_stimeTable[startTime].etCheck > endTime){
            alert("開始時間、終了時間を正しく設定してください");
            return;
        }
        if(g_etimeTable[endTime].stCheck < startTime){
            alert("開始時間、終了時間を正しく設定してください");
            return;
        }
    }

    // set gobal data
    g_configure["workType"].value = workType;
    g_configure["startTime"].value = startTime;
    g_configure["endTime"].value = endTime;
    g_configure["restTime"].value = restTime;
    g_configure["UserID"].value = document.getElementById('Configure_id').value;
    g_configure["UserName"].value = document.getElementById('Configure_name').value;
    g_configure["workComment"].value = document.getElementById('Configure_workComment').value;
    g_configure["restComment"].value = document.getElementById('Configure_restComment').value;
    g_configure["toAddress"].value = document.getElementById('Configure_toAddress').value;

    // store 
    storeHashData(tbl_configure,g_configure,atr_configure);
    //ページ表示処理を行う
    showTopPage();
    $('#Configure').popup('close');
}

//ページが表示されるたびに実行する
$(document).on('popupafteropen', '#Configure', function() {
    //ポップアップを閉じるためのおまじない
    $("#Configure").popup({history: false});
});

/**
 * Topページ表示時用関数
*/
function showTopPage(){
    // set title
    document.getElementById('title_ym'  ).innerHTML = g_date.getFullYear() + "年 " +  (g_date.getMonth()+1) + "月";
    document.getElementById('title_name').innerHTML = g_configure['UserName'].value + " さん";
    
    // remove list View
    document.getElementById("listView").removeChildren();

    // create Date List View
    createListView();

    // set monthly report
    setMonthlyData(g_date);
}

/**
 * 設定ポップアップ起動
 */
function openConfigure() {
    
    //画面メニュー作成
    // modified select menu
    document.getElementById('Configure_workType').selectedChange(g_configure['workType'].value);
    document.getElementById('Configure_startTime').selectedChange(g_configure['startTime'].value);
    document.getElementById('Configure_endTime').selectedChange(g_configure['endTime'].value);
    document.getElementById('Configure_restTime').selectedChange(g_configure['restTime'].value);
    document.getElementById('Configure_id').value = g_configure["UserID"].value;
    document.getElementById('Configure_name').value = g_configure["UserName"].value;
    document.getElementById('Configure_workComment').value = g_configure["workComment"].value;
    document.getElementById('Configure_restComment').value = g_configure["restComment"].value;
    document.getElementById('Configure_toAddress').value = g_configure["toAddress"].value;
    
    Configure_setMenuEnable(g_configure['workType'].value);
    
    $('#Configure_workType').selectmenu('refresh');
    
    //ポップアップ起動
    $("#Configure").popup("open",{positionTo: "window", transition: "pop", overlayTheme:"a"});
}

/**
 * 登録・削除ポップアップ起動
 */
function openEditDayData() {
    
    // set title
    document.getElementById('editDayData_title_ymd' ).innerHTML = g_date.YYYYnMMyDDh() + g_date.kWk();
    document.getElementById('editDayData_title_name').innerHTML = g_configure['UserName'].value + " さん";
    
    // modified select menu
    if(g_workData[g_date.YYYYbMMbDD()] == undefined){
        document.getElementById('editDayData_workType').selectedChange(g_configure['workType'].value);
        document.getElementById('editDayData_startTime').selectedChange(g_configure['startTime'].value);
        document.getElementById('editDayData_endTime').selectedChange(g_configure['endTime'].value);
        document.getElementById('editDayData_restTime').selectedChange(g_configure['restTime'].value);
        document.getElementById('editDayData_workComment').value = g_configure["workComment"].value;
        document.getElementById('editDayData_restComment').value = g_configure["restComment"].value;
        editDayData_setMenuEnable(g_configure['workType'].value);
    }
    else {
        document.getElementById('editDayData_workType').selectedChange(g_workData[g_date.YYYYbMMbDD()].workType);
        document.getElementById('editDayData_startTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].startTime);
        document.getElementById('editDayData_endTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].endTime);
        document.getElementById('editDayData_restTime').selectedChange(g_workData[g_date.YYYYbMMbDD()].restTime);
        document.getElementById('editDayData_workComment').value = g_workData[g_date.YYYYbMMbDD()].workComment;
        document.getElementById('editDayData_restComment').value = g_workData[g_date.YYYYbMMbDD()].restComment;
        editDayData_setMenuEnable(g_workData[g_date.YYYYbMMbDD()].workType);
    }
    
    $('#editDayData_workType').selectmenu('refresh');
    
    //ポップアップ起動
    $("#editDayData").popup("open",{positionTo: "window", transition: "pop", overlayTheme:"a"});
}
