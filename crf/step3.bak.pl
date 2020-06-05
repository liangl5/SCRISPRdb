#/usr/bin/perl -w
use Statistics::R;
#input is step3_out
# Create a communication bridge with R and start R
my $R = Statistics::R->new();

$R->startR;
$R->run(q`library(randomForest)`);
#set working directory
$R->run(q`setwd("/home/mubil/CRISPR/crf/")`);
$R->run(q`load("rf.RData")`);
#replace ... to working directory 
$R->run(q`dat<-read.csv("./genome/step3_out")`);
$R->run(q`result<-predict(model,dat)`);
#replace ... to working directory 
$R->run(q`write.table(result,"./genome/step4_out")`);

$R->stopR();
