#/usr/bin/perl -w
open FILE1,"<$ARGV[0]" or die "$!";#step4_out

while(<FILE1>){
	chomp;	
	next if /^\"x\"/;
	($id,$res)=$_=~/^\"(\d+)\"\s+\"(\w+)\"/;
	$hash{$id}=$res;
	$id="";$res="";
}

close FILE1 or die "$!";

#foreach $key(keys %hash){
#	print "$key->$hash{$key}\n";
#}








open FILE2, "<$ARGV[1]" or die "$!";#step1_out
$i=1;
while(<FILE2>){
	chomp;
	if(/^>/){
		$hash2{$i}=$_;	
		$i++;	
	}
}

close FILE2 or die "$!";

#foreach $k2(sort keys %hash2){
#	print "$k2->$hash2{$k2}\n";
#}






foreach $key(sort {$a<=>$b} keys %hash2){
	$tmp=$hash2{$key}." ".$hash{$key};
	push @array,$tmp;
	$tmp="";
}

$hash=();$hash2=();

#for(@array){
#	print "$_\n";
#}


for(@array){
	($na,$ou)=$_=~/^(>.+)\_\d+\s+(\w+)/;
	#print "$1-----$2\n";
	push @{$hs{$na}},$ou;
	$na="";$ou="";
}

foreach $key(keys %hs){
	#print "$key\t";
	$yes=0;
	for(@{$hs{$key}}){
		$sum=$#{$hs{$key}}+1;
		if($_=~/repeat/){
			$yes++;	
		}
	}
	#print "$yes->$sum\t";
	$pre=$yes/$sum;
	#print "$pre\n";
	if($pre>=0.5){
		push @good,$key;
	}
	
	$sum="";$yes="";
}
%hs=();

#for(@good){
#	print "-----$_\n";
#}


open FILE3, "<$ARGV[2]" or die "$!";#step0_out

$/="CRISPR";

while(<FILE3>){
	chomp;
	if(/^ORG/){
		print;
		($org)=$_=~/(NC\_\d+\.\d+)/g;
		next;
	}
	
	($start,$end)=$_=~/\s+Range\:\s+(\d+)\s+\-\s+(\d+)/;
	$tmp=">".$org."_".$start."_".$end;
	$out{$tmp}=$_;
	
	$start="";$end="";$tmp="";
}

for(@good){
	($ord)=$out{$_}=~/\s+(\d+)\s+Range/;
	$format{$ord}=$out{$_};
	$ord="";
}
@good=();
%out=();

$i=1;
foreach $key(sort {$a<=>$b} keys %format){
	@tmp=split(/\n/,$format{$key});
	$line1=shift @tmp;
	@tp2=split(/Range/,$line1);
	print "CRISPR\t$i\tRange$tp2[1]\n";
	for(@tmp){
		print "$_\n";
	}
	print "\n\n\n";
	$i++;
	@tmp=();@tp2=();
}
$i="";
%format=();

=cut
