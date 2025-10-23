using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext ctx) : IMemberRepository
{
  public async Task<IReadOnlyList<Member>> GetMembersAsync()
  {
    return await ctx.Members.ToListAsync();
  }

  public async Task<Member?> GetMemberByIdAsync(string id)
  {
    return await ctx.Members.FindAsync(id);
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
  {
    return await ctx.Members
      .Where(x => x.Id == memberId)
      .SelectMany(x => x.Photos)
      .ToListAsync();
  }

  public async Task<bool> SaveAllAsync()
  {
    // return number of changes to DB
    // i.e. if Save() failed 0 would be returned
    return await ctx.SaveChangesAsync() > 0;
  }

  public void Update(Member member)
  {
    ctx.Entry(member).State = EntityState.Modified;
  }
}
