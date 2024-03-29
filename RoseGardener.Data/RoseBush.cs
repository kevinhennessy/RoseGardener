//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RoseGardener.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class RoseBush
    {
        public RoseBush()
        {
            this.Ratings = new HashSet<Rating>();
            this.Selections = new HashSet<Selection>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string ImageSource { get; set; }
        public Nullable<int> Category_Id { get; set; }
        public string BriefDescription { get; set; }
        public string ProductTags { get; set; }
        public Nullable<int> Color_Id { get; set; }
    
        public virtual Category Category { get; set; }
        public virtual ICollection<Rating> Ratings { get; set; }
        public virtual ICollection<Selection> Selections { get; set; }
        public virtual Color Color { get; set; }
    }
}
