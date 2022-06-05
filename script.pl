use strict;
use warnings;
use File::Basename;
use Fcntl;
use File::Copy 'copy';

#===========================================================
#=Perlゼミ 「glob関数-ディレクトリに含まれるファイル一覧を取得」に書いてあった代替策の関数
sub get_files{
  my $dir = shift;
  
  opendir my $dh, $dir or die "Cannot change directory $dir : $!";
  
  my @dirs = map { "$_" } grep { $_ ne '.' && $_ ne '..'} readdir $dh;
  
  return @dirs;
}
#==========================================================

my $dir = "BMtest/StoryJS"; #あとで可変にすべきか
my $filename="";      #ファイル名拡張子付き ~~.**
my $filenamext = "";  #ファイル名のみ ~~
  my @files = get_files("BMtest/StoryJS");
  
if($#files != 0){  #ファイルがない、複数ある場合
  print "There is no acrive files!"; 
}else{
 
  $filenamext = $files[0];  
  $files[0] =~ /(.*)\..*$/;
  $filename = $1;

  print "$filename\n$filenamext\n";
}

#============================================
#TanoContBTAP================================
my $from = 'BTAPmaker/Moto/index.html';
my $tow = 'BTAPmaker/Ato/index.html';
copy($from,$tow); #TanoContBTAPのindexのコピー

my $new_button = "<button onclick=\"load_data($filename)\" class=\"btn_story_select general_story_color\">$filename</button>\n\t\t\t\t\t<!--button_frontier-->";

my $new_script = "<script src=\"StoryJS/$filenamext\"></script>\n\t<!--script_frontier-->";

#コードをコピーし、一部を変更~~~~~~~~~
open(IN , "<BTAPmaker/Ato/index.html");
my @data = <IN>;
close(IN);

open(OUT, ">BTAPmaker/Ato/index.html");
for(@data){
  $_ =~ s/<!--button_frontier-->/$new_button/g;
  $_ =~ s/<!--script_frontier-->/$new_script/;
  print OUT $_;
  
}
close(OUT);
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#============================================
#ResponsiveBTAP==============================
$from = 'BTAPmaker/Moto/ResponsiveBTAP.html';
$tow = 'BTAPmaker/Ato/ResponsiveBTAP.html';
copy($from,$tow);

my $new_li = "<li><a href='ResponsiveBTAP/$filename.html'>$filename</a></li>\n\t\t\t\t\t<!--li_frontier-->";

#コードをコピーし、一部を変更~~~~~~~~~
open(IN , "<BTAPmaker/Ato/ResponsiveBTAP.html");
@data = <IN>;
close(IN);

open(OUT, ">BTAPmaker/Ato/ResponsiveBTAP.html");
for(@data){
  $_ =~ s/<!--li_frontier-->/$new_li/g;
  print OUT $_;
}
close(OUT);
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#----------------------------------------------------
#ResponsiveBTAPの各ページHTML--------------------------
$from = "BTAPmaker/Moto/ResponsiveBTAP/ResTest.html";
$tow = "BTAPmaker/Ato/ResponsiveBTAP/$filename.html";
copy($from,$tow);

$new_script = "<script src=\"../StoryJS/$filenamext\"></script>\n\t<!--script_frontier-->";

my $new_start = "<span style=\"margin:10px;margin-right:auto;font-size:150%;font-weight:bold;padding:2px 2px 2px 2px;border:black solid 1px;\" onclick=\"load_data($filename);src_moto();\">初期化</span>\n\t<!--start_frontier-->";


#コードをコピーし、一部を変更~~~~~~~~~
open(IN , "<BTAPmaker/Ato/ResponsiveBTAP/$filename.html");
@data = <IN>;
close(IN);

open(OUT, ">BTAPmaker/Ato/ResponsiveBTAP/$filename.html");
for(@data){
  $_ =~ s/<!--script_frontier-->/$new_script/g;
  $_ =~ s/<!--start_frontier-->/$new_start/g;
  print OUT $_;
}
close(OUT);
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#============================================
#SimpleBTAP==================================
$from = 'BTAPmaker/Moto/SimpleBTAP/SimpleBTAPindex.html';
$tow = 'BTAPmaker/Ato/SimpleBTAP/SimpleBTAPindex.html';
copy($from,$tow);

$new_li = "<li><a href='Stories/$filename.html'>$filename</a></li>
\n\t\t\t\t<!--li_frontier-->";

#コードをコピーし、一部を変更~~~~~~~~~
open(IN , "<BTAPmaker/Ato/SimpleBTAP/SimpleBTAPindex.html");
@data = <IN>;
close(IN);

open(OUT, ">BTAPmaker/Ato/SimpleBTAP/SimpleBTAPindex.html");
for(@data){
  $_ =~ s/<!--li_frontier-->/$new_li/g;
  print OUT $_;
}
close(OUT);
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#--------------------------------------------
#SimpleBTAPの各ページHTML----------------------

$from = 'BTAPmaker/Moto/SimpleBTAP/Stories/SinTest.html';
$tow = "BTAPmaker/Ato/SimpleBTAP/Stories/$filename.html";
copy($from,$tow);

$new_script = "<script src=\"../../StoryJS/$filenamext\"></script>\n\t<!--script_frontier-->";

$new_button = "<button onclick=\"load_data($filename);src_moto();\">始める</button>\n\t\t\t\t<!--button_frontier-->";


#コードをコピーし、一部を変更~~~~~~~~~
open(IN , "<BTAPmaker/Ato/SimpleBTAP/Stories/$filename.html");
@data = <IN>;
close(IN);

open(OUT, ">BTAPmaker/Ato/SimpleBTAP/Stories/$filename.html");
for(@data){
  $_ =~ s/<!--script_frontier-->/$new_script/g;
  $_ =~ s/<!--button_frontier-->/$new_button/g;
  print OUT $_;
}
close(OUT);
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~