console.log("No easter eggs here! Go away");

// IIFE - Immediately Invoked Function Expression
(function(libraries){
    libraries(window.jQuery, window, document);
}(function($, window, document) {

    var TAMPLATE_TABLE =
        '<table id="tblCustom" width="150px" cellpadding="3" cellspacing="0">' +
        '<tbody>' +
        '<tr>' +
        '<td class="td_list" id="menu_link">Личный отдел</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="td_list" style="font-weight:normal;cursor:pointer;" id="scheudle_link">' +
        '&nbsp;&nbsp;Мое расписание' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="td_list" style="font-weight:normal;cursor:pointer;" id="plan_link">' +
        '&nbsp;&nbsp;Учебный план' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    function setStorageData(select, setting) {
        return function (data) {
            select.val(data[setting])
                .click();
        }
    }

    function setWeek(select) {
        return function () {
            var option = $(this);
            if (option.val() == 0)
                return true;

            var strs = option.text().split(/[.-]/),
                monday = getMonday(new Date());

            if ((monday.getDate() == parseInt(strs[0])) &&
                ((monday.getMonth() + 1) == parseInt(strs[1])) &&
                (monday.getFullYear() == parseInt(strs[2]))) {
                console.log("Date catched!");
                select.val(option.val());
                return false;
            }
        }
    }

    function DOMReady() {
        $(TAMPLATE_TABLE).insertBefore("#tblLinks");

        $('#scheudle_link').click( function () {
            var $divRes = $("#divRes");
            $divRes.html("<img src='../img/loading.gif' border='0'>");

            $.post("../process.php", {pagenum: 'tdeduGraph_common'}, function (resp) {
                $divRes.load(resp, null, function () {
                    var faculty = $("#repProfId");
                    var course = $("#repCourseId");

                    //setup faculty and course
                    chrome.storage.local.get("faculty", setStorageData(faculty, "faculty"));
                    chrome.storage.local.get("course", setStorageData(course, "course"));

                    //setup image download link
                    $divRes.find("tbody").append(
                            '<tr height="16px"></tr><tr><td width="130px" colspan="3" >' +
                            '<a id="download">Сохранить как изображение</a>' +
                            '</td></tr>"'
                    );

                    $("#download").click(function () {
                        var link = this;
                        html2canvas(document.getElementById('divPrint'), {
                            // width: 1024,
                            // height: 768,
                            onrendered: function (canvas) {
                                link.href = canvas.toDataURL();
                                link.download = "msu_scheudle.jpg"
                            }
                        });
                    });

                    //show table
                    $divRes.show();

                    //setup week
                    setTimeout(function () {
                        var week = $("#repWeekId");
                        week.find("option").each(setWeek(week));

                        //load scheudle
                        $("#repGraph").click();
                    }, 600);

                });
            });
        });


        $('#plan_link').click(function () {
            var $divRes = $("#divRes");
            $divRes.html("<img src='../img/loading.gif' border='0'>");

            $.post("../process.php", {pagenum: 'tdeduPlan_common'}, function (resp) {
                $divRes.load(resp, null, function () {
                    var year = $("#eduplanId");
                    var faculty = $("#profId");

                    year.val(3);
                    chrome.storage.local.get("faculty", setStorageData(faculty, "faculty"));

                    $divRes.show();
                });
            });
        });
    }

    //DOM ready
    $(document).ready(DOMReady);

}));
