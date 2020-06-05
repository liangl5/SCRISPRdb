#~/bin/sh
###those scripts are new version with the cout off of kmer 0.2, 0.2 and 0.25
###and the random forest cutoff is 0.5
cd genome
files=`ls`

for f in $files; do
	echo $f
	#do some thing here
	java -jar ../crt_kmer5_num2.jar $f step0_out
	perl ../step1.pl step0_out >step1_out
	RNAfold --noPS <step1_out >step2_out	
	perl ../step2.pl step2_out >step3_out
	perl ../step3.pl step3_out >step4_out
	perl ../step4.pl step4_out step1_out step0_out >step5_out
	perl ../step5.pl step5_out >step6_out
	phobos-linux-gcc4.1.2 --outputFormat 3 step6_out >step7_out
	perl ../step6.pl step7_out step5_out >step8_out
	perl ../step7.pl step8_out >step9_out
	
	perl ../step8.pl step9_out >../CRISPRs/$f
	
	rm step0_out step1_out step2_out step3_out step4_out step5_out step6_out step7_out step8_out step9_out
done 

