using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RoseGardener.Data;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;

namespace RoseGardener.HotTowel.Api
{
    [BreezeController]
    public class RoseGardenerController : ApiController
    {
        readonly EFContextProvider<RoseGardenerEntities> _contextProvider =
            new EFContextProvider<RoseGardenerEntities>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        [HttpGet]
        public object Lookups()
        {
            var categories = _contextProvider.Context.Categories;
            var ratings = _contextProvider.Context.Ratings;
            var colors = _contextProvider.Context.Colors;
            return new { categories, ratings, colors };
        }

        [HttpGet]
        public IQueryable<RoseBush> RoseBushes()
        {
            return _contextProvider.Context.RoseBushes;
        }

        [HttpGet]
        public IQueryable<Person> Persons()
        {
            return _contextProvider.Context.People;
        }

        [HttpGet]
        public IQueryable<Selection> Selections()
        {
            return _contextProvider.Context.Selections;
        }
    }
}