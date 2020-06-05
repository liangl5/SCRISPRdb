DROP TABLE IF EXISTS `CRISPRs`;
DROP TABLE IF EXISTS `Complete_Genome`;
DROP TABLE IF EXISTS `NCBI_RefSeq`;

CREATE TABLE `NCBI_RefSeq` (
  `release_num` int(11) NOT NULL,
  `release_date` date NOT NULL,
  `release_notes` varchar(500) NOT NULL,
  `comments` varchar(500) NOT NULL,
   PRIMARY KEY (`release_num`)
);

CREATE TABLE `Complete_Genome` (
  `genome_id` int(11) NOT NULL,
  `release_num` int(11) NOT NULL,
  `RefSeqAssembly_Accession` varchar(50) NOT NULL,
  `GenBankAssembly_Accession` varchar(50) NOT NULL,
  `RefSeqCategory` int(11) NOT NULL,
  `taxId` int(11) NOT NULL,
  `species_taxId` int(11) NOT NULL,
  `organism_name` varchar(100) NOT NULL,
  `infraspecific_name` varchar(100) NOT NULL,
  `isolate` varchar(30) NOT NULL,
  `genome_length` int(11) NOT NULL,
  `fasta_file_name` varchar(50) NOT NULL,
  PRIMARY KEY (`genome_id`),
  FOREIGN KEY (`release_num`) REFERENCES `NCBI_RefSeq` (`release_num`)
);


CREATE TABLE `CRISPRs` (
  `crispr_id` int(11) NOT NULL,
  `genome_id` int(11) NOT NULL,
  `range_begin` int(11) NOT NULL,
  `range_end` int(11) NOT NULL,
  `repeat_positions` int(11) NOT NULL,
  `spacer_positions` int(11) NOT NULL,
  `repeat_count` int(11) NOT NULL,
  `spacer_count` int(11) NOT NULL,
   PRIMARY KEY (`crispr_id`),
   FOREIGN KEY (`genome_id`) REFERENCES `Complete_Genome` (`genome_id`)
);

