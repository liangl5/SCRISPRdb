#/usr/bin/perl -w
@tsr=(".",")");
@ch=(A,G,C,T);

for(@tsr){
	$sa1=$_;
	for(@tsr){
		$sa2=$_;
		for(@tsr){
			$sa3=$_;
			for(@ch){
				$ca=$_;
				$tt=$sa1.$sa2.$sa3.$ca;
				push(@CHAR,$tt);
				}
			}
		}
	}
@tsr=();@ch=();
$sa1="";$sa2="";$sa3="";$ca="";$tt="";
#print "Str\t";
for(@CHAR){
	print "$_,";
}
print "tag\n";
#########################
$/=">";
open IN, "<$ARGV[0]" or die "$!"; #input is step2_out
<IN>;
while(<IN>){
	chomp;
	@tmp=split(/\n/,$_);

	#print "$tmp[0]";##########

	$tmp[1]=~tr/U/T/;
	$str=$1 if ($tmp[2]=~/^(.+)\s+/);
	#$str=~tr/\(/\)/;
	$len=length $tmp[1];
	
	
	for($i=0; $i<$len-2; $i++){
		$fra=substr($str,$i,3);
		$middle=substr($tmp[1],$i+1,1);
		$middle_fra=$fra.$middle;
		push (@seq,$middle_fra);
		}
	foreach $key1(@seq){
		$hh{$key1}+=1;
		}
	$total=$#seq+1;
	
	#print ">$tmp[0]\t";
	foreach $key2(@CHAR){
		if(exists $hh{$key2}){
			$subtotal=$hh{$key2}/$total;
			print "$subtotal,";
		}else{
			print "0,";
			}
		}
	print "random\n";

	#sleep(5);
	@seq=();$fra="";$middle_fra="";%hh=();
	@tmp=();$str="";$total="";$subtotal="";
}

