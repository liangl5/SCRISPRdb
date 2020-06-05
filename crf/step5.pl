#/usr/bin/perl -w

$/="CRISPR";
open IN, "<$ARGV[0]" or die "$!";
while(<IN>){
	chomp;
	next if /^OR/;
	@tmp=split /\n/,$_;
	for(@tmp){
		if(/(\d+)\s+Range/){
			$it=$1;
		}elsif(/^\d+\s+(\w+)\s+(\w+)\s+\[/){
			$seq.=$1.$2;
		}elsif(/^\d+\s+(\w+)\s+/){
			$seq.=$1;
		}else{
			next;
		}
	}
	
	print ">$it\n$seq\n";
	@tmp=();
	$it="";
	$seq="";
}
