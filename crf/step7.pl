#!/usr/bin/perl -w
use List::Util 'max';

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

foreach $key(sort keys %hash){
	@tp=split(/\n/,$hash{$key});
	#print "@tp[-2]\n";
	for($i=3;$i<($#tp-1);$i++){
		if($tp[$i]=~/^\d+\s+(\w+)\s+(\w+)/){
			#print "$1\t$2\n";
			$seq.=$1.$2;		
			push @repeat,$1;
			push @spacer,$2;
		}elsif($tp[$i]=~/^\d+\s+(\w+)/){
			#print "$1\n";
			push @repeat,$1;
			$seq.=$1;
		}
	}

	##################
#=pod	
	for(@repeat){
		$len=length $_;
		for($i=0;$i<$len-2;$i++){
			$sub=substr($_,$i,3);
			push @subre,$sub;
			$sub="";
		}
		
		for(@subre){
			$re{$_}++;
		}
	
		foreach $key(sort {$b<=>$a} values %re){
			push @MaxRe,$key;
		}
		#print "$max\n";
		
		$max=shift @MaxRe;
		$re_max=$max/($#subre+1);
		#print $max/($#subre+1),"<><>\n";
		push @reMax,$re_max;
		$re_max="";
		@subre=();
		@MaxRe=();
		%re=();
		$len="";
	
	}	
#=cut calculate the maximum number of repeat Freq 
	
	$mvRe=max(@reMax);	

	##################
#=pod
	for(@spacer){
		$len=length $_;
		for($i=0;$i<$len-2;$i++){
			$sub=substr($_,$i,3);
			push @subsp,$sub;
			$sub="";
		}
		
		for(@subsp){
			$sp{$_}++;
		}
		
		foreach $value(sort {$b<=>$a} values %sp){
			push @Max,$value;
		}
		
		
		$sp_max=shift @Max;
		$spacerM=$sp_max/($#subsp+1);
		#print $sp_max/($#subsp+1),"\n";
		push @spMax,$spacerM;
		$spacerM="";
		@subsp=();
		@Max=();
		%sp=();
		$len="";
	}

	$mvSp=max(@spMax);

	############################
	$lenW=length $seq;
	for($i=0;$i<$lenW-2;$i++){
		$subW=substr($seq,$i,3);
		#print "$subW\n";
		push @subWS,$subW;
		$subW="";
	}
	
	for(@subWS){
		$wholeseq{$_}++;
	}
	
	foreach $wv(sort {$b<=>$a} values %wholeseq){
		push @Wmax,$wv;
	}
	
	$who_max=shift @Wmax;
	#print "$who_max\n$#subWS\n";
	$mvC=$who_max/($#subWS+1);
	#print "$mvC\n";
	@Wmax=();
	%wholeseq=();
	@subWS=();
	############################

	#print "$mvC\t$mvRe\t$mvSp\n";
	if($mvSp<0.2 || $mvRe<0.2 || $mvC<0.25){
		
		$new{$key}=$hash{$key};
		#print "$new{$key}\tYes\n";
	}
#=cut calculate the maximum number of spacer Freq
#if these two maximum number are both larger that their cutoff (0.3 and 0.4)
#push them into a new hash for printing out
#otherwise delete them from the result 
	##################
	$mvC="";
	$mvSp="";
	$mvRe="";
	@tp=();
	@repeat=();
	@spacer=();
	@spMax=();
	@reMax=();
	$seq="";
	
#=cut
}

%hash=();
=pod
foreach $kk(sort keys %new){
	print "CRISPR\t$new{$kk}";
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

