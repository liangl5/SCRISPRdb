#!/usr/bin/perl -w
use List::MoreUtils qw(uniq);
use List::Util 'min';
$/="CRISPR";
open FILE,"<$ARGV[0]" or die "$!";

while(<FILE>){
	chomp;
	print if /^OR/;
	next if /^OR/;
	$id=(split /\n/,$_)[0];
	#print "$id\n";
	$hash{$id}=$_;
	$id="";
}


$i=0;

foreach $key(sort keys %hash){
	@tmp=split /\n/,$hash{$key};
	for(@tmp){
		if($_=~/^\d+\s+\w+\s+(\w+)/){
			push @spacer,$1;
		}
	}
	if($#spacer>0){
		for(@spacer){
			$leng=length $_;
			#print "$_>>>>>$i\n";
			push @same,$leng;
			$leng="";$i++;
		}
		@out= uniq(@same);
		@same=(); 
		if($#out==0){
			for(1..$#spacer){
				$tmp=shift @spacer;
				for(@spacer){
					$res=XORhd($tmp,$_);
					#print "$res\n";
					$ttp=$res/$out[0];
					push @s_out,$ttp;
					$res="";
					$ttp="";
				}
				$tmp="";
			}
			
			$min=min(@s_out);
			#print "$min\n";####
			if($min>0.5){
				$new{$key}=$hash{$key};
			}else{
				#print "NONONONONONONONON\n";
				#next;
			}
			$min="";
			@s_out=();
		}else{
			$new{$key}=$hash{$key};#if the spacers have different length, they won't be processed.
		}
	}else{
		$new{$key}=$hash{$key};#if only one spacer in the array, it won't be processed.
	}
	@tmp=();
	@spacer=();
	@out=();
}
%hash=();

=pod
foreach $xian(sort keys %new){
	print "$xian\n";
}
=cut



$i=1;
foreach $key(sort keys %new){
        @tmp=split(/\n/,$new{$key});
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

%new=();



sub XORhd {
	return ($_[0] ^ $_[1]) =~ tr/\001-\255//;
}


