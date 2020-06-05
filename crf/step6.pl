#!/usr/bin/perl -w

#file1 is the step6_out (from the phobos)
open F1,"<$ARGV[0]" or die "$!";
while(<F1>){
	chomp;
	if(/^(\d+)\s+\d+/){
		@tmp=split /\s+/,$_;
		if($tmp[6]>=10){
			$num{$tmp[0]}=1;
		}
		@tmp=();
	}
}



#file2 is step5_out (the result without phobos)
$/="CRISPR";
open F2, "<$ARGV[1]" or die "$!";
while(<F2>){
	chomp;
	print if /^ORG/;
	next if /^ORG/;
	($id)=$_=~/(\d+)\s+Range/;
	$hash{$id}=$_;
	$id="";
}

foreach $key (sort {$a<=>$b} keys %hash){
	unless(exists $num{$key}){
		$res{$key}=$hash{$key};
	}
}

%hash=();
%num=();

$i=1;
foreach $kk(sort {$a<=>$b} keys %res){
	@tmp=split(/\n/,$res{$kk});
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
%res=();
