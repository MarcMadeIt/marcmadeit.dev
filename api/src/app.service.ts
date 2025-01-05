import { Injectable } from '@nestjs/common';
import { BlogsService } from './blogs/blogs.service';
import { ProjectsService } from './projects/projects.service';
import { PodcastsService } from './podcasts/podcasts.service';


@Injectable()
export class AppService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly projectsService: ProjectsService,
    private readonly podcastsService: PodcastsService,
  ) {}

  async getCounts(): Promise<{ blogs: number; projects: number; podcasts: number }> {
    const [blogs, projects, podcasts] = await Promise.all([
      this.blogsService.countBlogs(),
      this.projectsService.countProjects(),
      this.podcastsService.countPodcasts(),
    ]);
    return { blogs, projects, podcasts };
  }
}
