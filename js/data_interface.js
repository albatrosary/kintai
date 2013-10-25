// This is a JavaScript file
// Copyright&copy;2013 System Lab, Ltd. All Rights Reserved.

const def_sTime = 8.0;
const def_extension = ".csv";
const atr_csvFile = [
    ["date", "年月日"],
    ["sday", "就業日"],
    ["kday", "勤務日数"],
    ["start", "開始時間"],
    ["end", "終了時間"],
    ["time", "勤務時間"],
    ["work", "実働時間"],
    ["rest", "休憩時間"],
    ["orst", "その他休憩時間"],
    ["over", "平日所定外時間"],
    ["nght", "平日深夜時間"],
    ["hovr", "休日所定外時間"],
    ["hngt", "休日深夜時間"],
    ["yday", "有休日数"],
    ["dday", "代休日数"],
    ["tday", "特休日数"],
    ["aday", "欠勤日数"], 
    ["oday", "その他休暇日数"],
    ["restComment", "その他休憩理由"],
    ["workComment", "備考"]
];

////////////////////////////////////////////////////////////
// アカウント
const tbl_configure = "dat_configure";
const atr_configure = ["key","value"];
const def_configure = [
    ["UserID",""],
    ["UserName","《未登録》"],
    ["workType","000"],
    ["startTime","000"],
    ["endTime","000"],
    ["workComment",""],
    ["restTime","0"],
    ["restComment",""],
    ["fileTitle","勤怠データ"],
    ["toAddress","（未設定）"]
];

////////////////////////////////////////////////////////////
// 休日イベント
const tbl_holidays = "dat_holidays";
const atr_holidays = ["key","type","text"];
const def_holidays = [
    ["2013/1/1"  ,"0","元日"        ],
    ["2013/1/2"  ,"0","年始休日"    ],
    ["2013/1/3"  ,"0","年始休日"    ],
    ["2013/1/4"  ,"0","当社指定休日"],
    ["2013/1/14" ,"0","成人の日"    ],
    ["2013/2/11" ,"0","建国記念の日"],
    ["2013/3/20" ,"0","春分の日"    ],
    ["2013/4/29" ,"0","昭和の日"    ],
    ["2013/4/30" ,"1","年休推奨日"  ],
    ["2013/5/1"  ,"1","年休推奨日"  ],
    ["2013/5/2"  ,"1","年休推奨日"  ],
    ["2013/5/3"  ,"0","憲法記念日"  ],
    ["2013/5/4"  ,"0","みどりの日"  ],
    ["2013/5/5"  ,"0","こどもの日"  ],
    ["2013/5/6"  ,"0","振替休日"    ],
    ["2013/7/15" ,"0","海の日"      ],
    ["2013/8/12" ,"1","特休推奨日"  ],
    ["2013/8/13" ,"1","特休推奨日"  ],
    ["2013/8/14" ,"1","特休推奨日"  ],
    ["2013/8/15" ,"1","特休推奨日"  ],
    ["2013/8/16" ,"1","特休推奨日"  ],
    ["2013/9/16" ,"0","敬老の日"    ],
    ["2013/9/23" ,"0","秋分の日"    ],
    ["2013/10/14","0","体育の日"    ],
    ["2013/11/3" ,"0","文化の日"    ],
    ["2013/11/4" ,"0","振替休日"    ],
    ["2013/11/23","0","勤労感謝の日"],
    ["2013/12/23","0","天皇誕生日"  ],
    ["2013/12/30","0","当社指定休日"],
    ["2013/12/31","0","年末年始休日"],
    ["2014/1/1"  ,"0","元日"        ],
    ["2014/1/2"  ,"0","年末年始休日"],
    ["2014/1/3"  ,"0","年末年始休日"],
    ["2014/1/13" ,"0","成人の日"    ],
    ["2014/2/11" ,"0","建国記念の日"],
    ["2014/3/21" ,"0","春分の日"    ]
];

////////////////////////////////////////////////////////////
// 勤休区分
const tbl_workType = 'dat_workType';
const atr_workType = ["key","text","startKey","startFlag","endKey","endFlag","restFlag","htime","kday","yday","dday","tday","aday","oday"];
const def_workType = [
    ["000" ,"（未選択）　　　","000","0","000","0","0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],
    ["010" ,"出勤（通常）　　","310","1","180","1","1","0.0","1.0","0.0","0.0","0.0","0.0","0.0"],
    ["020" ,"出勤（午前半休）","380","0","180","1","1","3.0","1.0","0.5","0.0","0.0","0.0","0.0"],
    ["030" ,"出勤（午後半休）","310","1","070","0","1","5.0","1.0","0.5","0.0","0.0","0.0","0.0"],
    ["040" ,"休暇（有休）　　","000","0","000","0","0","0.0","0.0","1.0","0.0","0.0","0.0","0.0"],
    ["050" ,"休暇（代休）　　","000","0","000","0","0","0.0","0.0","0.0","1.0","0.0","0.0","0.0"],
    ["060" ,"休暇（特休）　　","000","0","000","0","0","0.0","0.0","0.0","0.0","1.0","0.0","0.0"],
    ["070" ,"休暇（欠勤）　　","000","0","000","0","0","0.0","0.0","0.0","0.0","0.0","1.0","0.0"],
    ["080" ,"休暇（その他）　","000","0","000","0","0","0.0","0.0","0.0","0.0","0.0","0.0","1.0"]
];

////////////////////////////////////////////////////////////
// 休憩時間リスト
const tbl_restTime = 'dat_restTime';
const atr_restTime = ["key","text","time"];
const def_restTime = [
    ["000","  0.0 h ","0.0"],
    ["010","  0.5 h ","0.5"],
    ["020","  1.0 h ","1.0"],
    ["030","  1.5 h ","1.5"],
    ["040","  2.0 h ","2.0"],
    ["050","  2.5 h ","2.5"],
    ["060","  3.0 h ","3.0"],
    ["070","  3.5 h ","3.5"],
    ["080","  4.0 h ","4.0"],
    ["090","  4.5 h ","4.5"],
    ["100","  5.0 h ","5.0"],
    ["110","  5.5 h ","5.5"],
    ["120","  6.0 h ","6.0"],
    ["130","  6.5 h ","6.5"],
    ["140","  7.0 h ","7.0"],
    ["150","  7.5 h ","7.5"],
    ["160","  8.0 h ","8.0"]
];

////////////////////////////////////////////////////////////
// 勤怠リスト
const tbl_workData = 'dat_workData';
const atr_workData = ["key","startTime","endTime","workType","workComment","restTime","restComment"];
const def_workData = [
];

////////////////////////////////////////////////////////////
// 勤務時間テーブル（開始時間）
const tbl_stimeTable = 'dat_stimeTable';
const atr_stimeTable = ["key","text","time","etCheck","kinTime","jidTime","ngtTime"];
const def_stimeTable = [
    ["000","（未選択）","","0.0","0.0","0.0"],
    ["010","前日 18:00","18:00","010", "15.00", "13.00", "06.00"],
    ["020","前日 18:30","18:30","010", "14.50", "12.50", "06.00"],
    ["030","前日 19:00","19:00","010", "14.00", "12.00", "06.00"],
    ["040","前日 19:30","19:30","010", "13.50", "11.50", "06.00"],
    ["050","前日 20:00","20:00","010", "13.00", "11.00", "06.00"],
    ["060","前日 20:30","20:30","010", "12.50", "10.50", "06.00"],
    ["070","前日 21:00","21:00","010", "12.00", "10.00", "06.00"],
    ["080","前日 21:30","21:30","010", "11.50", "09.50", "06.00"],
    ["090","前日 22:00","22:00","010", "11.00", "09.00", "06.00"],
    ["100","前日 22:30","22:30","010", "10.50", "09.00", "06.00"],
    ["110","前日 23:00","23:00","010", "10.00", "08.50", "05.50"],
    ["120","前日 23:30","23:30","010", "09.50", "08.00", "05.00"],
    ["130","当日 00:00","00:00","010", "09.00", "07.50", "04.50"],
    ["140","当日 00:30","00:30","010", "08.50", "07.00", "04.00"],
    ["150","当日 01:00","01:00","010", "08.00", "06.50", "03.50"],
    ["160","当日 01:30","01:30","010", "07.50", "06.00", "03.00"],
    ["170","当日 02:00","02:00","010", "07.00", "05.50", "02.50"],
    ["180","当日 02:30","02:30","010", "06.50", "05.00", "02.00"],
    ["190","当日 03:00","03:00","010", "06.00", "05.00", "02.00"],
    ["200","当日 03:30","03:30","010", "05.50", "04.50", "01.50"],
    ["210","当日 04:00","04:00","010", "05.00", "04.00", "01.00"],
    ["220","当日 04:30","04:30","010", "04.50", "03.50", "00.50"],
    ["230","当日 05:00","05:00","010", "04.00", "03.00", "00.00"],
    ["240","当日 05:30","05:30","010", "03.50", "03.00", "00.00"],
    ["250","当日 06:00","06:00","010", "03.00", "02.50", "00.00"],
    ["260","当日 06:30","06:30","010", "02.50", "02.00", "00.00"],
    ["270","当日 07:00","07:00","010", "02.00", "01.50", "00.00"],
    ["280","当日 07:30","07:30","010", "01.50", "01.00", "00.00"],
    ["290","当日 08:00","08:00","010", "01.00", "00.50", "00.00"],
    ["300","当日 08:30","08:30","010", "00.50", "00.00", "00.00"],
    ["310","当日 09:00","09:00","010", "00.00", "00.00", "00.00"],
    ["320","当日 09:30","09:30","020","-00.50","-00.50", "00.00"],
    ["330","当日 10:00","10:00","030","-01.00","-01.00", "00.00"],
    ["340","当日 10:30","10:30","040","-01.50","-01.50", "00.00"],
    ["350","当日 11:00","11:00","050","-02.00","-02.00", "00.00"],
    ["360","当日 11:30","11:30","060","-02.50","-02.50", "00.00"],
    ["370","当日 12:00","12:00","070","-03.00","-03.00", "00.00"],
    ["380","当日 12:45","12:45","080","-03.75","-03.00", "00.00"],
    ["390","当日 13:15","13:15","090","-04.25","-03.50", "00.00"],
    ["400","当日 13:45","13:45","100","-04.75","-04.00", "00.00"],
    ["410","当日 14:15","14:15","110","-05.25","-04.50", "00.00"],
    ["420","当日 14:45","14:45","120","-05.75","-05.00", "00.00"],
    ["430","当日 15:15","15:15","130","-06.25","-05.50", "00.00"],
    ["440","当日 15:45","15:45","140","-06.75","-06.00", "00.00"],
    ["450","当日 16:15","16:15","150","-07.25","-06.50", "00.00"],
    ["460","当日 16:45","16:45","160","-07.75","-07.00", "00.00"],
    ["470","当日 17:15","17:15","170","-08.25","-07.50", "00.00"],
    ["480","当日 17:45","17:45","180","-08.75","-08.00", "00.00"],
    ["490","当日 18:00","18:00","190","-09.00","-08.00", "00.00"],
    ["500","当日 18:30","18:30","200","-09.50","-08.50", "00.00"],
    ["510","当日 19:00","19:00","210","-10.00","-09.00", "00.00"],
    ["520","当日 19:30","19:30","220","-10.50","-09.50", "00.00"],
    ["530","当日 20:00","20:00","230","-11.00","-10.00", "00.00"],
    ["540","当日 20:30","20:30","240","-11.50","-10.50", "00.00"],
    ["550","当日 21:00","21:00","250","-12.00","-11.00", "00.00"],
    ["560","当日 21:30","21:30","260","-12.50","-11.50", "00.00"],
    ["570","当日 22:00","22:00","270","-13.00","-12.00", "00.00"],
    ["580","当日 22:30","22:30","280","-13.50","-12.00", "00.00"],
    ["590","当日 23:00","23:00","290","-14.00","-12.50","-00.50"],
    ["600","当日 23:30","23:30","300","-14.50","-13.00","-01.00"]
];
////////////////////////////////////////////////////////////
// 勤務時間テーブル（終了時間）
const tbl_etimeTable = 'dat_etimeTable';
const atr_etimeTable = ["key","text","time","stCheck","kinTime","jidTime","ngtTime"];
const def_etimeTable = [
    ["000","（未選択）","","0.0","0.0","0.0"],
    ["010","当日 09:00","09:00","310", "00.00","-08.00", "00.00"],
    ["020","当日 09:30","09:30","320", "00.50","-07.50", "00.00"],
    ["030","当日 10:00","10:00","330", "01.00","-07.00", "00.00"],
	["040","当日 10:30","10:30","340", "01.50","-06.50", "00.00"],
	["050","当日 11:00","11:00","350", "02.00","-06.00", "00.00"],
	["060","当日 11:30","11:30","360", "02.50","-05.50", "00.00"],
	["070","当日 12:00","12:00","370", "03.00","-05.00", "00.00"],
	["080","当日 12:45","12:45","380", "03.75","-05.00", "00.00"],
	["090","当日 13:15","13:15","390", "04.25","-04.50", "00.00"],
	["100","当日 13:45","13:45","400", "04.75","-04.00", "00.00"],
	["110","当日 14:15","14:15","410", "05.25","-03.50", "00.00"],
	["120","当日 14:45","14:45","420", "05.75","-03.00", "00.00"],
	["130","当日 15:15","15:15","430", "06.25","-02.50", "00.00"],
	["140","当日 15:45","15:45","440", "06.75","-02.00", "00.00"],
	["150","当日 16:15","16:15","450", "07.25","-01.50", "00.00"],
	["160","当日 16:45","16:45","460", "07.75","-01.00", "00.00"],
	["170","当日 17:15","17:15","470", "08.25","-00.50", "00.00"],
	["180","当日 17:45","17:45","480", "08.75", "00.00", "00.00"],
	["190","当日 18:00","18:00","490", "09.00", "00.00", "00.00"],
	["200","当日 18:30","18:30","500", "09.50", "00.50", "00.00"],
	["210","当日 19:00","19:00","510", "10.00", "01.00", "00.00"],
	["220","当日 19:30","19:30","520", "10.50", "01.50", "00.00"],
	["230","当日 20:00","20:00","530", "11.00", "02.00", "00.00"],
	["240","当日 20:30","20:30","540", "11.50", "02.50", "00.00"],
	["250","当日 21:00","21:00","550", "12.00", "03.00", "00.00"],
	["260","当日 21:30","21:30","560", "12.50", "03.50", "00.00"],
	["270","当日 22:00","22:00","570", "13.00", "04.00", "00.00"],
	["280","当日 22:30","22:30","580", "13.50", "04.00", "00.00"],
	["290","当日 23:00","23:00","590", "14.00", "04.50", "00.50"],
	["300","当日 23:30","23:30","600", "14.50", "05.00", "01.00"],
	["310","翌日 00:00","00:00","600", "15.00", "05.50", "01.50"],
	["320","翌日 00:30","00:30","600", "15.50", "06.00", "02.00"],
	["330","翌日 01:00","01:00","600", "16.00", "06.50", "02.50"],
	["340","翌日 01:30","01:30","600", "16.50", "07.00", "03.00"],
	["350","翌日 02:00","02:00","600", "17.00", "07.50", "03.50"],
	["360","翌日 02:30","02:30","600", "17.50", "08.00", "04.00"],
	["370","翌日 03:00","03:00","600", "18.00", "08.00", "04.00"],
	["380","翌日 03:30","03:30","600", "18.50", "08.50", "04.50"],
	["390","翌日 04:00","04:00","600", "19.00", "09.00", "05.00"],
	["400","翌日 04:30","04:30","600", "19.50", "09.50", "05.50"],
	["410","翌日 05:00","05:00","600", "20.00", "10.00", "06.00"],
	["420","翌日 05:30","05:30","600", "20.50", "10.00", "06.00"],
	["430","翌日 06:00","06:00","600", "21.00", "10.50", "06.00"],
	["440","翌日 06:30","06:30","600", "21.50", "11.00", "06.00"],
	["450","翌日 07:00","07:00","600", "22.00", "11.50", "06.00"],
	["460","翌日 07:30","07:30","600", "22.50", "12.00", "06.00"],
	["470","翌日 08:00","08:00","600", "23.00", "12.50", "06.00"],
	["480","翌日 08:30","08:30","600", "23.50", "13.00", "06.00"]
];

// prototype method
Date.prototype.getDayName = function() {
    var dayNames = ['日','月','火','水','木','金','土'];
    return dayNames[this.getDay()];
};

Date.prototype.kWk = function() {
    return "（" + this.getDayName() + "）";
};

Date.prototype.YYYYnMMyDDh = function() {
    return this.getFullYear() + "年" +  (this.getMonth()+1) + "月" + this.getDate() + "日";
};

Date.prototype.YYYYbMMbDD = function() {
    return this.getFullYear() + "/" +  (this.getMonth()+1) + "/" + this.getDate();
};

Date.prototype.YYYYbMM = function() {
    return this.getFullYear() + "/" +  (this.getMonth()+1);
};

Element.prototype.appendChildren = function(hash) {
    for (var i in hash) {
        var element = document.createElement('option'); 
        element.id        = hash[i].key;
        element.value     = hash[i].key;
        element.innerHTML = hash[i].text;
        this.appendChild(element);
    }
};

Element.prototype.selectedChange = function(key) {
    for(i=0;i<this.length;i++){
        if(this[i].value == key){
            this.selectedIndex = i;
            break;
        }
    }
};

Element.prototype.removeChildren = function(){
    while(this.hasChildNodes()) {
        this.removeChild(this.firstChild);
    }
};

// csv_string to multi array
String.prototype.csvParse = function(sep) {
    var rows = this.trim().split('\n').map(function(line) {
        return line.split(sep);
    });
    var width = rows[0].length;
    return rows.map(function(row) {
        var obj = new Array;
        for (i=0; i<width;i++){
            obj[i] = row[i].slice(1,row[i].length-1);
        }
    	return obj;
    });
};

String.prototype.replaceAll = function(org, dest) {  
  return this.split(org).join(dest);
};

// return holiday check
function isHoliday(tbl,day){
    var week = day.getDay();
    
    if(week == 0 || week == 6) { return true; }
    
    key = day.YYYYbMMbDD();
    if(tbl[key] == undefined){
        return false;
    }
    else {
        if("0" == tbl[key].type) {
            return true;
        }
        else {
            return false;
        }
    }
}
// store hash data from global valiable
function storeHashData(tblName,listData,property) {

    var arry = new Array;
    
    for(var keyString in listData) {
        var marry = new Array;
        for(j=0;j<property.length;j++){
            marry[j] = listData[keyString][property[j]];
            arry.push(marry);
        }
    }
    localStorage.setItem(tblName, JSON.stringify(arry));
}

// load hash data from storage
function loadStorageHashData(tblName,listData,property) {

    var elements;
    var hash = new Object;
    
    var list = localStorage.getItem(tblName);

    if (list == null) {
        elements = listData;
        localStorage.setItem(tblName, JSON.stringify(elements));
    }else{
        elements = JSON.parse(list);
    }
    
    for(i=0; i < elements.length; i++){
        var record = new Object;
        for(j=0;j<property.length;j++){ record[property[j]] = elements[i][j]; }
        hash[elements[i][0]]=record;
    }
    
    return hash;
}

//----------------------------------------------------
//
// getMonthlyData return items
//
//monthly.year
//monthly.month
//monthly.sday 就業日数
//monthly.kday 勤務日数
//monthly.yday 有休日数
//monthly.dday 代休日数
//monthly.tday 特休日数
//monthly.aday 欠勤日数
//monthly.oday その他休暇日数
//monthly.time 勤務時間
//monthly.work 実働時間
//monthly.rest 休憩時間
//monthly.over 平日所定外時間
//monthly.nght 平日深夜時間
//monthly.hovr 休日所定外時間
//monthly.hngt 休日深夜時間
//monthly.orst その他休憩時間
function getMonthlyData(date) {

    var monthly = new Object;

    var y = date.getFullYear();
    var m = date.getMonth();

    monthly.year  = y;
    monthly.month = m + 1;
    monthly.sday=0; // 就業日数
    monthly.kday=0; // 勤務日数
    monthly.yday=0; // 有休日数
    monthly.dday=0; // 代休日数
    monthly.tday=0; // 特休日数
    monthly.aday=0; // 欠勤日数
    monthly.oday=0; // その他休暇日数
    monthly.time=0; // 勤務時間
    monthly.work=0; // 実働時間
    monthly.rest=0; // 休憩時間
    monthly.over=0; // 平日所定外時間
    monthly.nght=0; // 平日深夜時間
    monthly.hovr=0; // 休日所定外時間
    monthly.hngt=0; // 休日深夜時間
    monthly.orst=0; // その他休憩時間

    for(i=1;i<=31;i++){

        var idate = new Date(y,m,i);

        if(idate == null || m != idate.getMonth())
            break;

        ymdStr = idate.YYYYbMMbDD();

        monthly.sday+=(isHoliday(g_holidays,idate)) ? 0 : 1; // 就業日数

        // holiday count
        if(g_workData[ymdStr] == undefined){ continue; }

        // get selection key
        var type  = g_workData[ymdStr].workType;
        var stime = g_workData[ymdStr].startTime;
        var etime = g_workData[ymdStr].endTime;
        var rtime = g_workData[ymdStr].restTime;

        var tbl = getDailyData(idate,type,stime,etime,rtime);

        monthly.kday+=tbl.kday; // 勤務日数
        monthly.yday+=tbl.yday; // 有休日数
        monthly.dday+=tbl.dday; // 代休日数
        monthly.tday+=tbl.tday; // 特休日数
        monthly.aday+=tbl.aday; // 欠勤日数
        monthly.oday+=tbl.oday; // その他休暇日数
        monthly.time+=tbl.time; // 勤務時間
        monthly.work+=tbl.work; // 実働時間
        monthly.rest+=tbl.rest; // 休憩時間
        monthly.over+=tbl.over; // 平日所定外時間
        monthly.nght+=tbl.nght; // 平日深夜時間
        monthly.hovr+=tbl.hovr; // 休日所定外時間
        monthly.hngt+=tbl.hngt; // 休日深夜時間
        monthly.orst+=tbl.orst; // その他休憩時間
    }

    return monthly;
}

//----------------------------------------------------
//
// getDailyData return items
//
//tbl.date  年月日[yyyy/mm/dd]
//tbl.type  勤休区分
//tbl.sday  就業日
//tbl.kday  勤務日数
//tbl.yday  有休日数
//tbl.dday  代休日数
//tbl.tday  特休日数
//tbl.aday  欠勤日数
//tbl.oday  その他休暇日数
//tbl.start 開始時間
//tbl.end   終了時間
//tbl.time  勤務時間
//tbl.work  実働時間
//tbl.rest  休憩時間
//tbl.over  平日所定外時間
//tbl.nght  平日深夜時間
//tbl.hovr  休日所定外時間
//tbl.hngt  休日深夜時間
//tbl.orst  その他休憩時間
function getDailyData(day,type,start,end,rest) {

    var sTime = 0;
    var hTime = 0;
    var mTime = 0;
    var oTime = 0;
    var tbl = new Object;

    // 初期化
    tbl.date  = day.getFullYear() + "/" + ("0"+(day.getMonth()+1)).slice(-2) + "/" + ("0"+day.getDate()).slice(-2);
    tbl.type  = "000";  // 勤休区分
    tbl.sday  = (isHoliday(g_holidays,day)) ? 0 : 1; // 就業日数
    tbl.kday  = 0.0;    // 勤務日数
    tbl.yday  = 0.0;    // 有休日数
    tbl.dday  = 0.0;    // 代休日数
    tbl.tday  = 0.0;    // 特休日数
    tbl.aday  = 0.0;    // 欠勤日数
    tbl.oday  = 0.0;    // その他休暇日数
    tbl.start = "";     // 開始時間
    tbl.end   = "";     // 終了時間
    tbl.time  = 0.0;    // 勤務時間
    tbl.work  = 0.0;    // 実働時間
    tbl.rest  = 0.0;    // 休憩時間
    tbl.over  = 0.0;    // 平日所定外時間
    tbl.nght  = 0.0;    // 平日深夜時間
    tbl.hovr  = 0.0;    // 休日所定外時間
    tbl.hngt  = 0.0;    // 休日深夜時間
    tbl.orst  = 0.0;    // その他休憩時間

    // 未選択時は初期化状態で戻す
    if("000" == type){ return tbl; }

    tbl.type   = type;                                // 勤休区分
    tbl.sday   = (isHoliday(g_holidays,day)) ? 0 : 1; // 就業日数
    tbl.kday   = parseFloat(g_workType[type].kday);   // 勤務日数
    tbl.yday   = parseFloat(g_workType[type].yday);   // 有休日数
    tbl.dday   = parseFloat(g_workType[type].dday);   // 代休日数
    tbl.tday   = parseFloat(g_workType[type].tday);   // 特休日数
    tbl.aday   = parseFloat(g_workType[type].aday);   // 欠勤日数
    tbl.oday   = parseFloat(g_workType[type].oday);   // その他休暇日数
    tbl.start  = (start == "000") ? "" : g_stimeTable[start].time; // 開始時間
    tbl.end    = (end   == "000") ? "" : g_etimeTable[end].time;   // 終了時間

    // 休暇（勤務日数に含めない日）は時間計算まで行わない
    if("0.0" == g_workType[type].kday) return tbl;

    // 就業時間
    sTime = def_sTime * tbl.sday;

    // 半休時間
    hTime = parseFloat(g_workType[type].htime);

    // 勤務時間
    tbl.time   = parseFloat(g_stimeTable[start].kinTime)
               + parseFloat(g_etimeTable[end].kinTime);

    // 実働時間
    tbl.work   = def_sTime
               + parseFloat(g_stimeTable[start].jidTime)
               + parseFloat(g_etimeTable[end].jidTime)
               - parseFloat(g_restTime[rest].time);

    // 休憩時間
    tbl.rest   = tbl.time - tbl.work;

    // その他休憩時間
    tbl.orst   = parseFloat(g_restTime[rest].time);

    // 深夜時間
    mTime    = parseFloat(g_stimeTable[start].ngtTime)
             + parseFloat(g_etimeTable[end].ngtTime);

    // 深夜時間
    tbl.nght = (tbl.sday) ? mTime : 0; // 平日深夜時間
    tbl.hngt = (tbl.sday) ? 0 : mTime; // 休日深夜時間

    // 所定外時間
    if((tbl.work - (sTime - hTime)) <= 0) {
        oTime = ("0.0" == g_workType[type].kday) ? 0 : tbl.work - (sTime - hTime);
    }
    else {
        if(((tbl.work - (sTime - hTime)) - mTime) <= 0) {
            oTime = 0;
        }
        else {
            oTime = (tbl.work - (sTime - hTime)) - mTime;
        }
    }
    tbl.over = (tbl.sday) ? oTime : 0; // 平日所定外時間
    tbl.hovr = (tbl.sday) ? 0 : oTime; // 休日所定外時間

    return tbl;
}

/* ファイルオブジェクトが作成できないためコメントアウト
function createCSVFile(end_function) {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,function(fs){
        var fname = g_configure.UserName.value.trim()
                  + "_" + g_configure.fileTitle.value + "_"
                  + g_date.getFullYear()
                  + g_configure.fileTitle.value + g_date.getFullYear()
                  + ("0"+(g_date.getMonth()+1)).slice(-2)
                  + def_extension;
        fs.root.getFile(fname, {create: true, exclusive: false},function(fileEntry){
            fileEntry.createWriter(function(wt){
                // write error
                wt.onerror = function(e){ fileSystemFail(e); };
                // write complete
                wt.onwriteend = function(e){
                    end_function(dstr,fileEntry);
                };
                // create csv array data
                var y = g_date.getFullYear();
                var m = g_date.getMonth();
                var dstr = "";
                // Title output
                for(j=0;j<atr_csvFile.length;j++){
                    dstr += '"' + atr_csvFile[j][1] + '"';
                    dstr += (j+1 < atr_csvFile.length) ? "," : "";
                }
                dstr += '\n';
                // Data output
                for(d=1;d<=31;d++){
                    var date = new Date(y,m,d);
                    if(date == null || m != date.getMonth()) break;
                    var ymd = date.YYYYbMMbDD();
                    var type  = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].workType;
                    var stime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].startTime;
                    var etime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].endTime;
                    var rtime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].restTime;
                    var tbl = getDailyData(date,type,stime,etime,rtime);
                    for(j=0;j<atr_csvFile.length;j++){
                        if(tbl[atr_csvFile[j][0]] == undefined){
                            if(g_workData[ymd] == undefined){
                                dstr += '"' + '"';
                            }
                            else {
                                dstr += '"' + g_workData[ymd][atr_csvFile[j][0]] + '"';
                            }
                        }
                        else {
                            dstr += '"' + tbl[atr_csvFile[j][0]] + '"';
                        }
                        dstr += (j+1 < atr_csvFile.length) ? "," : "";
                    }
                    dstr += '\n';
                }
                wt.write(dstr);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}
*/

function createCSVFile() {

    // create csv array data
    var y = g_date.getFullYear();
    var m = g_date.getMonth();
    var dstr = "";
    // Title output
    for(j=0;j<atr_csvFile.length;j++){
        dstr += '"' + atr_csvFile[j][1] + '"';
        dstr += (j+1 < atr_csvFile.length) ? "," : "";
    }
    dstr += '\n';
    // Data output
    for(d=1;d<=31;d++){
    var date = new Date(y,m,d);
    if(date == null || m != date.getMonth()) break;
        var ymd = date.YYYYbMMbDD();
        var type  = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].workType;
        var stime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].startTime;
        var etime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].endTime;
        var rtime = (g_workData[ymd] == undefined) ? "000": g_workData[ymd].restTime;
        var tbl = getDailyData(date,type,stime,etime,rtime);
        for(j=0;j<atr_csvFile.length;j++){
            if(tbl[atr_csvFile[j][0]] == undefined){
                if(g_workData[ymd] == undefined){
                    dstr += '"' + '"';
                }
                else {
                    dstr += '"' + g_workData[ymd][atr_csvFile[j][0]] + '"';
                }
            }
            else {
                dstr += '"' + tbl[atr_csvFile[j][0]] + '"';
            }
            dstr += (j+1 < atr_csvFile.length) ? "," : "";
        }
        dstr += '\n';
    }
    return dstr;
}
