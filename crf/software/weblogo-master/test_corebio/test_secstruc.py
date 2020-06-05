import unittest

from corebio import *
from corebio.secstruc import *
from corebio.seq import *
from corebio.seq_io import *
from test_corebio import *


class test_secstruc(unittest.TestCase):
    def test_1(self):
        with testdata_stream('1crn.dssp') as f:
            record = dssp.DsspRecord(f)
        reduced = fa_reduce_secstruc_to_ehl(record.secondary())
        assert str(reduced) == 'LEELLLHHHHHHHHHHHLLLLLHHHHHHHHLLEELLLLLLLLLLLL'


if __name__ == '__main__':
    unittest.main()
