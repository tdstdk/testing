$(document).ready(function()
{
	$( "#tabs" ).tabs({
		beforeLoad: function( event, ui ) {
			ui.jqXHR.fail(function() {
				ui.panel.html(
					"Нет соединения с сервером, попробуйте зайти позже." );
			});
		}
	});
	// $("#tabs").tabs({
	// 	ajaxOptions: {
	// 		error: function(xhr, status, index, anchor) {
	// 			$(anchor.hash).html("Нет соединения с сервером, попробуйте зайти позже.");
	// 		}
	// 	}
	// });
});
function ShowLoadBar(mesto)
{
	$('<div align="center"><br><img src="pics/loadbar.gif" width="128" height="15" border="0" alt="загрузка..." title="загрузка..."><br></div>').appendTo(mesto);				
}
function ShowLoadBarMini(mesto)
{
	$(mesto).html('<img src="pics/loader_f.gif" width="15" height="15" border="0" alt="ждите..." title="ждите...">');				
}
function ShowLoadBarMicro(mesto)
{
	$(mesto).html('<img src="pics/loader_m.gif" width="16" height="11" border="0" alt="ждите..." title="ждите...">');				
}
function ShowForm(param)
{
        var id = param.id;
        var ignor = param.ignor || false;

        if (ignor) var form_ans = "<div style='background-color: #FDE5DD; border: 1px solid #ff0000; margin-bottom: 2em; padding: 1em;'>Извините, Вы внесены в игнор-лист автора дневника и не можете писать ответы.</div>";
        else {
            var form_ans = "<fieldset style='width: 710px; border: 1px solid #DFDFDF;'><legend>Текст ответа</legend>"
                + "<form id='answer_form'>"
                + "<textarea id='ans_text' cols='50' rows='5' name='ans_text'></textarea>"
                + "<input type='hidden' name='id' value='" + id + "'>"
                + "<div><input type='button' value='Отправить' class='form_button' onClick='submitAnswer(" + id + ")'></div>"
                + "</form>"
                + "";
        }
        CloseAnswerForms();
        $("#fta_" + id).html("<div align='center'>" + form_ans + "</div>");
        $("#ans_text").markItUp(mySettings);
        $("#post_rfbtn_" + id).show();

        return false;

}
		
function CloseAnswerForms() { $("div[id^=fta]").html(""); }

function submitAnswer (id)
{
    $(document).ready(function(){
	var send_fd = $("#answer_form").serialize();
	CloseAnswerForms();
	ShowLoadBar("#fta_"+id);

		$.ajax({
			type: "POST",
			cache: false,
			url: "ajax_save_ans.php",
			data: send_fd,
			success: function(data){
				$("#fta_"+id).html(data);
			}
		})
	});
}
function submitVote (id, action)
{
    $(document).ready(function(){
        var send_fd = $("#vote_form_"+id).serialize();
        // CloseAnswerForms();
        $("#poll_"+id).html('');
        ShowLoadBar("#poll_"+id);

        $.ajax({
            type: "POST",
            cache: false,
            url: "ajax_save_vote.php",
            data: send_fd+"&action="+action,
            success: function(data){
                $("#poll_"+id).html(data);
            }
        })
    });
}
function ShowAnswer(id, page, comment)
{
	$(document).ready(function(){
		
		if (page == 0) ShowLoadBar("#sap_"+id);
		else 
		{
			ShowToTop("#sap_"+id);
			ShowLoadBarMicro(".pageans_"+id);
		}
		
		$.post('ajax_answer.php',{id: id, page: page}, onAjaxAns);				

		function onAjaxAns(data)
		{
			$("#sap_"+id).html(" ");
			$("#sap_"+id).html(data);
			$("#post_ba_"+id).hide();
			if (comment == 'write') $("#post_bf_"+id).show();
			else $("#post_bсс_"+id).show();

			$("#post_rfbtn_"+id).show();			
		}
	});
	return false;

}
function MadeOnRake (id) { return $("#rbp_"+id).html('<a href="#" onclick="return RatingPost(\''+id+'\',\'good\');"><img src="pics/plus.gif" width="16" height="12" border="0" alt="плюс" title="плюс" /></a><a href="#" onclick="return RatingPost(\''+id+'\',\'bad\');"><img src="pics/minus.gif" width="16" height="12" border="0" alt="минус" title="минус"/></a>')};

function SubansToggle(id,mode)
{
	$(document).ready(function()
	{					 	
		if (mode=='yes') $("#ans_subp_"+id).html('<a href="#" onclick="return Subans(\''+id+'\',\'no\');"><img src="pics/com_s.png" width="16" height="16" border="0" alt="уведомлять об ответах" title="уведомлять об ответах" /></a>');
		else             $("#ans_subp_"+id).html('<a href="#" onclick="return Subans(\''+id+'\',\'yes\');"><img src="pics/com_u.png" width="16" height="16" border="0" alt="не сообщать об ответах" title="не сообщать об ответах" /></a>');
	});
}
function Subans(id,mode)
{
		ShowLoadBarMicro("#ans_subp_"+id);
		$.post('ajax_subans.php',{id: id, subscr: mode}, onAjaxSubscr);				
			
		function onAjaxSubscr(data)
		{						
			SubansToggle(id,mode);				
			$("#infordat").html(data);
		}			
	return false;
}

function ShowPost(id,comment)
{
	$(document).ready(function(){
		ShowLoadBar("#sfp_"+id);
		$.post('ajax_post.php',{id: id}, onAjaxMes);				
		
		function onAjaxMes(data)
		{
			$("#sfp_"+id).html(data);
			$("#post_bp_"+id).hide();
            if (comment == 'write') $("#post_bf_"+id).show();
            else $("#post_bсс_"+id).show();
            $("#post_rfbtn_"+id).show();
			
			MadeOnRake(id);					 
		}				
	});
	return false;		
}
function DelAns(id)
{
	if (confirm("Вы действительно хотите удалить сообщение?")) 
	{
		$(document).ready(function(){
			 	
			ShowLoadBarMini("#baa_"+id);

			$.post('del_ans.php',{id: id}, onAjaxDelAns);				
			
			function onAjaxDelAns(data)
			{
				$("#infordat").html(data);
			}			
		});
	}
	return false;
}
function DelPost(id)
{
	if (confirm("Вы действительно хотите удалить пост и все ответы к нему?")) 
	{
		$(document).ready(function(){
			 	
			ShowLoadBarMini("#bpa_"+id);

			$.post('del_post.php',{id: id}, onAjaxDelPost);				
			
			function onAjaxDelPost(data)
			{
				$("#infordat").html(data);
			}			
		});
	}
	return false;
}
function RatingPost(id,rating)
{
	$(document).ready(function(){
		 	
		ShowLoadBarMicro("#rbp_"+id);
	
		$.post('ajax_rating.php',{id: id, rating: rating}, onAjaxRatingPost);				
		
		function onAjaxRatingPost(data)
		{
			$("#infordat").html(data);
		}			
	});
	return false;
}
function RollPost(id)
{
	$("#post_roll_"+id).slideToggle("slow");
	$("#end_"+id).slideToggle();
	$(".post_rbtn_"+id).toggle(0);
	var targetOffset = $("#post_"+id).offset().top;
    $("html,body").animate({scrollTop: targetOffset}, "slow");
			
	return false;
}