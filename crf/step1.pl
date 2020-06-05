#/usr/bin/perl -w

open CO,"<$ARGV[0]" or die "$!";#input is step0 from CRT

$/="CRISPR";

$line1=<CO>;
@tp=split(/\n/,$line1);
for(@tp){
	if(/(NC\_\d+\.\d+)/){
		$na=$1;	
	}
}
@tp=();

while(<CO>){
	$i=0;
	chomp;
	@tmp=split(/\n/,$_);
	for(@tmp){
		if(/Range\:\s+(\d+)\s+\-\s+(\d+)/){
			$res=$1."_".$2;
			#print "$res\n";
		}elsif(/^\d+\s+(\w+)/){
			#$hash{$1}++;
			push @sequence, $1;
		}	
	}
	$res=$na."_".$res;
	foreach $key(@sequence){
		print ">$res"."_"."$i\n$key\n";
		$i++;	
	}
	%hash=();
	$res="";
	$i="";
	@tmp=();
	@sequence=();
}
$na="";

