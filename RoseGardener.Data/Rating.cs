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
    
    public partial class Rating
    {
        public int Id { get; set; }
        public int StarRating { get; set; }
        public string Comment { get; set; }
        public Nullable<int> Person_Id { get; set; }
        public Nullable<int> RoseBush_Id { get; set; }
    
        public virtual Person Person { get; set; }
        public virtual RoseBush RoseBush { get; set; }
    }
}
