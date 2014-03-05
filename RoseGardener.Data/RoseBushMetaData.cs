using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace RoseGardener.Data
{
    [MetadataType(typeof(RoseBushMetaData))]
    public partial class RoseBush
    {
        public class RoseBushMetaData
        {
            [StringLength(20), Required]
            public string Name { get; set; }

            [StringLength(20), Required]
            public string Description { get; set; }

            [StringLength(20), Required]
            public string BriefDescription { get; set; }

            [Required]
            public double Price { get; set; }

            //public object NoSuchProperty { get; set; }
        }
    }
}
