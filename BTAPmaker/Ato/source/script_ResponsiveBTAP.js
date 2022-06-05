//セーブデータのロード
  function load_savefile(txt){
    document.getElementById("t_savedata").textContent = txt;

  txt = txt.replace(/\r\n/g,'\n'); //改行コードの統一
  txt = txt.replace(/\r/g, '\n');	 //改行コードの統一

    var arr = txt.split("\n");
    for(var i = 0;i < arr.length;i++){
      if(arr[i].match(/flg:(.*)/)){             //フラグ
        for(var j = 0;j < RegExp.$1.length;j++){
          if(RegExp.$1.charAt(j) == "f"){
            flgarr[j] = false;
          }else{
            flgarr[j] = true;
          }
        }

      }else if(arr[i].match(/ite:(.*)/)){       //道具
        for(var j = 0; j < RegExp.$1.length; j++){
          if(RegExp.$1.charAt(j) == "f"){
            itearr[j]["hav"] = false;
          }else{
            itearr[j]["hav"] = true;
          }
        }
      }else if(arr[i].match(/fie:(.*)/)){       //ページ名
        fie = parseInt(RegExp.$1);
      }else if(arr[i].match(/num:(.*)/)){       //ページ名
        numarr = RegExp.$1.split(",");
      }
    }

    show_page();
    //旧版
    //block_d_desc_and_item();
    alert("セーブデータがロードされました。")
  }



  //セーブデータ書き込み用
  function makesave(){
    var ans = "flg:";    //フラグ
    for(var i=0;i<flgarr.length;i++){
      if(flgarr[i]){
        ans += "t";
      }else{
        ans += "f";
      }
    }

    ans += "\nite:";     //アイテム
    for(var i=0;i<itearr.length;i++){
      if(itearr[i]["hav"]){
        ans += "t";
      }else{
        ans += "f";
      }
    }

    ans += "\nfie:" + fie + "";  //ページ番号

    ans += "\nnum:" + numarr[0];     //番号
    for(var i = 1;i < numarr.length; i++){
      ans += "," + numarr[i];
    }

    return(ans);
  }

  //=========================================================================
  //リードミーの入手とアイテム欄非表示を初期化
  /*var v_chb_readme = document.getElementById("chb_readme"); 
  var v_chb_noitem = document.getElementById("chb_noitem");

  v_chb_readme.checked=false;
  v_chb_noitem.checked=false;
  if(v_chb_readme.checked){
    get_explanation();
  }

  if(v_chb_noitem.checked){
    show_item();
  }*/


  //=======================================
  //ページデータを整形して得る
  function load_data(scr){
    scr = scr.replace(/\r\n/g,'\n'); //改行コードの統一
    scr = scr.replace(/\r/g, '\n');	 //改行コードの統一

    var arr = scr.split("\n");
    var myRE = new RegExp("flag:(.+)>");

    if(!arr[0].match(/flag:(.+)>/)){
      alert("ページデータとして不適なものが選択されました。");
    }else{

      //走査する
      for(i=0;i<arr.length;i++){
        //「フラグ」タグ
        if(arr[i].match(/flag:(.+)>/)){
          flgarr = new Array(parseInt(RegExp.$1));
          for(var j=0;j<flgarr.length;j++){
            flgarr[j]=false;   //flagarrの初期化
          }
          i++;
        }
        //「アイテム」タグ
        if(arr[i].match(/item:(.+)>/)){
          itearr = new Array(parseInt(RegExp.$1));

          for(;i<arr.length;i++){     //タグの終わりまでforを続行する
            if(arr[i].match(/<\/item>/)){  //タグの終わり
              break;
            }else{
              //アイテムタグを、名前と説明に分ける
              if(arr[i].match(/\[(.+?)\](.+?)#(.+)/)){
                itearr[parseInt(RegExp.$1)] = 
									{nam: OpenInlineTag(RegExp.$2), 
									exp: OpenInlineTag(RegExp.$3),
									hav:false};
									//名前、説明文、所持しているか(初期値はfalse)
              }
            }
          }
          i++;
        }
        if(arr[i].match(/BFmap:([0-9]+)>/)){
            arr = BFtoBTAP(arr, i);
				}

				//「マップ(フィールド)」タグ
				if(arr[i].match(/map:([0-9]+)>/)){
					fiearr = new Array(parseInt(RegExp.$1));
					var temp_map=0;

					for(;i<arr.length;i++){    //タグの終わりまでforを続行する
						if(arr[i] == "</map>"){  //タグの終わり
							break;
						}else{
							if(arr[i].match(/\[(.+?)\]/)){  //フィールド番号
								temp_map=parseInt(RegExp.$1);
								fiearr[temp_map]={nam: "", exp:"", sel:[]};
								
							}else if(arr[i].match(/n:(.+)/)) {  //名前
								fiearr[temp_map]["nam"] = OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/e:(.+)/)) {  //説明文
								fiearr[temp_map]["exp"] = OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/\^\^(.*)$/)){  //改行を簡潔にした説明文
								fiearr[temp_map]["exp"] += OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/\^(.*)$/)){  //改行を簡潔にした説明文
								fiearr[temp_map]["exp"] += OpenInlineTag(RegExp.$1) + "<br>";
								
							}else if(arr[i].match(/v:(.*)$/)){  //v要素（道具の内容を描写タブ部にかく）
								fiearr[temp_map]["exp"] += itearr[parseInt(RegExp.$1)]["exp"] + "<br>";

							}else if(arr[i].match(/s:(.+)#(.+)/)) { //選択肢
								fiearr[temp_map]["sel"].push(new Array(RegExp.$1, RegExp.$2));
							}
						}
					}
				}
			}
			
			//旧版ーページ表示させる
			//block_d_desc_and_item();
			
			switch(document.getElementById("jsonize_change").value){
				case "json":
					//fiearrとitearrの内容を、＊JSON形式で＊、d_descに表示する。
					var jstr = JSON.stringify({"fie": fiearr,"ite":itearr});
					document.getElementById("d_desc").innerText = jstr;
					break;
					
				default:
					//イントロダクションを表示？もしくはページに直行？
					if(document.getElementById("chb_abstract").checked){
						show_introduction();
					}else{
						mov(0);
						show_page();
					}
			}
			
		}
	}

  //BFstyle to BTAP=========================================================
  function BFtoBTAP(arr,n){
  var ifpage = 0; //ページ編集中？（空白文字が改行かページ区切りかの判別に）
  var temp_num = -1;
  var back_num = temp_num-1;
  var front_num = temp_num+1;

  for(var i = n; i< arr.length;i++){
    if(arr[n].match(/BFmap:([0-9]+)/)){  //改行を簡潔にした説明文
      arr[n].replace(/BFmap:([0-9]+)/g, "map:($1)");
    }

    //map部おわり
    if(arr[i] == "</map>"){
      break;
    }

    //ページ開始
    if(arr[i].match(/\[(.+)/)){
      temp_num++;
      back_num = temp_num - 1;
      front_num = temp_num + 1;
      arr[i] = "[" + temp_num + "]" ;
      arr.splice(i+1, 0, "n:" + RegExp.$1); //"n:" + RegExp.$1);//n要素の追加
      i++;
      ifpage = 1;

    }else if(arr[i].match(/\]/)){
      if(arr[i].match(/bf/)){//前後に壁
        arr[i] = "";
      }else if(arr[i].match(/b\]/)){//後ろに壁
        arr[i] = "s:次へ#mov(" + front_num + ")";
      }else if(arr[i].match(/f\]/)){//後ろに壁
        arr[i] = "s:戻る#mov(" + back_num + ")";
      }else{//前後に壁無し
        arr.splice(i,1,"s:次へ#mov(" + front_num +")", "s:戻る#mov(" + back_num +")");
      }
      ifpage = 0;
    }else if((ifpage == 1) && !(arr[i].match(/s:/)) && !(arr[i].match(/v:/)))　{ //e要素に「^」を追加
      arr[i] = "^" + arr[i];
    }
  }

  return(arr);
  }

//ルビやハイパーリンクなどのBTAPタブをHTMLになおす。==============================

	function OpenInlineTag(scr){
		var ans = scr;
		
		//ルビの設定<r> => <ruby>
		ans = ans.replace(/<r>(.+?)#(.+?)<\/r>/g, "<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>");
		
		//ハイパーリンクの設定 <hl> => <span>
		ans = ans.replace(/<hl>(.+?)#(.+?)<\/hl>/g, "<span onclick=\"$2\" class=\"hl-border\">$1</span>");
    
		return(ans);
	}
	
  //==============================================================================
  //「ページ」タブの表示
  function show_page(){
    var page=document.getElementById("d_desc");

    //ページ名＆ページ説明div
		var ans = '<p><span style="font-size:200%;font-weight:bold;">' + fiearr[fie]["nam"] + "</span></p><div>"
                      + fiearr[fie]["exp"] + '</div><div style="display:inline-block;"><ul>';

    //ページの選択肢
    for(var i=0;i<fiearr[fie]["sel"].length;i++){
      ans += '<li class="li_sel" onclick="' + fiearr[fie]["sel"][i][1] + '">'
                        + fiearr[fie]["sel"][i][0] + "</li>";
    }
    ans += "</ul></div>";

    page.innerHTML = ans;
  }
	
	//========================================================================
	
	//イントロダクションを表示
	function show_introduction(){
    var page=document.getElementById("d_desc");
		
		var abst = '<p><span style="font-size:200%;font-weight:bold;">' + fiearr[fie]["nam"] + "</span></p>";
		
		abst += '<ul><li class="li_sel" onclick="mov(0)">始める</li></ul>';
		
		//ページ数
		abst += "<p>[ ページ数 : " + fiearr.length + " ]</p>";
		
		//リードミー
		abst += "<p>[ リードミー ]<br>" + itearr[itearr.length-1]["exp"] + "</p>";
		
		page.innerHTML = abst;
	}
	
  //アイテムの有無でオプションボタンを変える===========================================
  function display_ite(){
    var item_sel = document.getElementById("d_item_sel");
    var item_exp = document.getElementById("d_item_exp");
    item_exp.innerHTML="";
    item_sel.innerHTML="";

    for(var i=0;i<itearr.length;i++){
      if(itearr[i]["hav"]){
        //「もちもの」タブにラジオボタンを追加する。
        item_sel.innerHTML +=
          '<label><input type="radio" name="item" onclick="' +
          'document.getElementById(&quot;d_item_exp&quot;).innerHTML=&quot;' +
          itearr[i]["exp"] + '&quot;"/>' +
          itearr[i]["nam"] + "</label><br>";
      }
    }
  }
  //もとに戻す==================================
  function remov(){
  if (breadcrumbs.length <= 1){ //セーブパンくずがない場合（初期値）
    alert("戻せません");
  }else{
    breadcrumbs.shift();
    load_savefile(breadcrumbs[0]);//セーブパンくずの最初の要素が１つ前のセーブデータ
  }
  }
  
  //選択肢スキップ==============================
  function pageskip(){ 
    while(1){
      if(fiearr.length == 0){ //まだページが選択されていない
        alert("スキップできません");
        break;
      }
      
      if (fiearr[fie]["sel"].length == 1){  //選択肢数が1の時、その先へ
        eval(fiearr[fie]["sel"][0][1]);
      }else{
        alert("スキップしました");  //複数選択肢があるページ、もしくはページの終わり(選択肢0)までスキップ
        break;
      }
    }
  }
  //スクリプトでかける関数=========================================================-
  //マップ移動
  function mov(tow) {
  fie = tow;
  breadcrumbs.unshift(makesave());  //セーブを追加、パンくずを追加する
  show_page();
  }

  //アイテム獲得
  function geti(n){
    itearr[n]["hav"]=true;
    display_ite();
  }

  //アイテムをなくす
  function losi(n){
    itearr[n]["hav"]=false;
    display_ite();
  }

  //アイテムをなくす
  function get_explanation(n){
    var v_chb_readme = document.getElementById("chb_readme");

    if (itearr.length != 0){
      if (v_chb_readme.checked){  //チェックボックス
        itearr[itearr.length-1]["hav"]= true;
      }else{
        itearr[itearr.length-1]["hav"]= false;
      }
      
      display_ite();
    }
  }


  //フラグtrueに
  function onflg(n){
    flgarr[n]=true;
  }

  //フラグfalseに
  function offlg(n){
    flgarr[n]=false;
  }

  //フラグがtrueか
  function iflg(n){
    return(flgarr[n]);
  }

  //道具を持っているか
  function hav(n){
    return(itearr[n]["hav"]);
  }

  //document.getElementById(id).innerHTML = str の糖衣
  function gebi(id, str){
    document.getElementById(id).innerHTML = str;
  }

  //番号の書き込み
  function wnum(i, num){
    numarr[i] = num;
  }

  //番号の読み込み
  function rnum(i){
    return(numarr[i])
  }

  //numarrの引き算(numarr要素からnumarr要素を引く)
  function nminn(n1, n2){
    numarr[n1] -= numarr[n2];
  }

  //numarrの引き算(numarr要素から実際に数字を引く)
  function nminx(n, x){
    numarr[n] -= x;
  }


  //numarrの足し算(numarr要素にnumarr要素を足す)
  function naddn(n1, n2){
    numarr[n1] += numarr[n2];
  }

  //numarrの足し算(numarr要素に実際に数字を足す)
  function naddx(n, x){
    numarr[n] += x;
  }

  //Math.randomの糖衣
  function rand(){
    return(Math.random());
  }

  //Math.floorの糖衣
  function flor(x){
    return(Math.floor(x));
  }

  //Math.ceilの糖衣
  function ceil(x){
    return(Math.ceil(x));
  }
	
